import type { TaskStatus } from '@/components/TaskCard';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeOut,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import elementIcon from 'assets/elements.png';
import headerWave from 'assets/header-wave.png';
import ConfirmationModal from '@/components/ConfirmationModal';
import QuickActionsSheet from '@/components/QuickActionsSheet';
import { TaskListSkeleton } from '@/components/SkeletonLoader';
import TaskCard from '@/components/TaskCard';
import UnderlineTabBar from '@/components/UnderlineTabBar';
import Colors from '@/styles/colors';
import { ApiError, apiRequest, validateArrayResponse } from '~/api/apiUtils';
import { API_ENDPOINTS, BASE_URL } from '~/api/config';
import styles from '../../styles/tabs/my-tasks-styles';
import { useAuth } from '../../utils/AuthContext';

interface Task {
  id: number;
  encrypted_id: string;
  pickup_date: string;
  start_time: string | null;
  end_time: string | null;
  location_name: string | null;
  status?: string;
  completed_at?: string | null;
  missed_at?: string | null;
  address?: {
    number?: string | null;
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
  } | null;
}

function formatTimeRange(
  startTime: string | null,
  endTime: string | null,
): string {
  if (!startTime || !endTime) return 'Time TBD';

  try {
    const parseTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(n => parseInt(n, 10));
      if (isNaN(hours) || isNaN(minutes)) return null;

      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${displayHours}:${displayMinutes} ${ampm}`;
    };

    const startFormatted = parseTime(startTime);
    const endFormatted = parseTime(endTime);

    if (!startFormatted || !endFormatted) return 'Time TBD';

    return `${startFormatted} - ${endFormatted}`;
  } catch {
    return 'Time TBD';
  }
}

function formatAddress(task: Task): string {
  if (task.address) {
    const { street, city } = task.address;
    const parts = [];
    if (street) parts.push(street);
    if (city) parts.push(city);
    if (parts.length > 0) return parts.join(', ');
  }

  if (task.location_name) {
    if (task.location_name.includes('Oakland')) return 'Oakland, CA';
    if (task.location_name.includes('Berkeley')) return 'Berkeley, CA';
    if (
      task.location_name.includes('San Francisco') ||
      task.location_name.includes('SF')
    )
      return 'San Francisco, CA';
    if (task.location_name.includes('San Jose')) return 'San Jose, CA';
    return 'Bay Area, CA';
  }

  return 'Address details in app';
}

function deriveTaskStatus(task: Task): TaskStatus {
  // Backend status enum: incomplete, complete, cancelled, in_progress, failed, cancelled_late
  // Note: GET /my_tasks only returns 'incomplete' tasks, so completed/failed won't appear
  // from that endpoint. We derive overdue from dates for incomplete tasks.
  if (task.status === 'complete' || task.completed_at) return 'completed';
  if (task.status === 'failed') return 'missed';
  if (task.status === 'in_progress') return 'active';

  // For 'incomplete' tasks, derive overdue from pickup_date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pickupDate = new Date(task.pickup_date);
  pickupDate.setHours(0, 0, 0, 0);

  if (pickupDate < today) return 'overdue';
  return 'active';
}

function formatStatusDate(task: Task): string | undefined {
  const dateStr = task.completed_at ?? task.missed_at;
  if (!dateStr) return undefined;
  try {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  } catch {
    return undefined;
  }
}

export default function MyTasksPage() {
  const router = useRouter();
  const { driver } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('active');

  // Quick actions state
  const [quickActionsVisible, setQuickActionsVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const fetchTasks = useCallback(
    async (isRefresh = false) => {
      if (!driver?.id) {
        setTasks([]);
        setIsLoading(false);
        return;
      }

      try {
        if (!isRefresh) setIsLoading(true);
        setError(null);

        // Fetch active (incomplete) and completed/failed tasks in parallel
        const [activeTasks, historyTasks] = await Promise.all([
          apiRequest<Task[]>(
            `${BASE_URL}${API_ENDPOINTS.MY_TASKS}?driver_id=${driver.id}`,
            { method: 'GET', validateResponse: validateArrayResponse },
          ),
          apiRequest<Task[]>(
            `${BASE_URL}${API_ENDPOINTS.MY_TASKS}?driver_id=${driver.id}&status=complete,failed`,
            { method: 'GET', validateResponse: validateArrayResponse },
          ),
        ]);

        setTasks([...activeTasks, ...historyTasks]);
      } catch (e: unknown) {
        const errorMessage =
          e instanceof ApiError ? e.message : 'Failed to load tasks';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        if (isRefresh) setIsRefreshing(false);
      }
    },
    [driver?.id],
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchTasks(true);
  }, [fetchTasks]);

  // Derive statuses and split into active/completed+missed
  const { activeTasks, completedTasks, activeCount } = useMemo(() => {
    const active: (Task & { derivedStatus: TaskStatus })[] = [];
    const completed: (Task & { derivedStatus: TaskStatus })[] = [];

    for (const task of tasks) {
      const status = deriveTaskStatus(task);
      const enriched = { ...task, derivedStatus: status };
      if (status === 'completed' || status === 'missed') {
        completed.push(enriched);
      } else {
        active.push(enriched);
      }
    }

    return {
      activeTasks: active,
      completedTasks: completed,
      activeCount: active.length,
    };
  }, [tasks]);

  const displayedTasks = activeTab === 'active' ? activeTasks : completedTasks;

  const handleCardPress = useCallback(
    (task: Task) => {
      router.push({
        pathname: '/pickup-details/[id]',
        params: {
          id: task.encrypted_id,
          location: task.location_name ?? '',
        },
      });
    },
    [router],
  );

  // Quick actions: long press on active card
  const handleCardLongPress = useCallback((task: Task) => {
    setSelectedTask(task);
    setQuickActionsVisible(true);
  }, []);

  const handleCloseQuickActions = useCallback(() => {
    setQuickActionsVisible(false);
    setSelectedTask(null);
  }, []);

  // Mark as delivered -> navigate to donation details to enter poundage/logs
  const handleMarkDelivered = useCallback(() => {
    if (!selectedTask) return;

    setQuickActionsVisible(false);
    setSelectedTask(null);
    router.push({
      pathname: '/donation-details/[id]',
      params: {
        id: selectedTask.encrypted_id,
        location: selectedTask.location_name ?? '',
      },
    });
  }, [selectedTask, router]);

  // Mark as missing: show confirmation first
  const handleMarkMissingPrompt = useCallback(() => {
    setQuickActionsVisible(false);
    setConfirmModalVisible(true);
  }, []);

  const handleConfirmMissing = useCallback(async () => {
    if (!selectedTask || !driver?.id) return;

    setConfirmModalVisible(false);
    try {
      const safeId = encodeURIComponent(selectedTask.encrypted_id);
      await apiRequest(
        `${BASE_URL}${API_ENDPOINTS.TASKS}/${safeId}/driver_mark_as_failed`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ driver_id: driver.id }),
        },
      );
      // Refresh the task list
      fetchTasks(true);
    } catch (e: unknown) {
      const errorMessage =
        e instanceof ApiError ? e.message : 'Failed to mark as missing';
      setError(errorMessage);
    } finally {
      setSelectedTask(null);
    }
  }, [selectedTask, driver?.id, fetchTasks]);

  const handleCancelMissing = useCallback(() => {
    setConfirmModalVisible(false);
    setSelectedTask(null);
  }, []);

  // Loading state with skeleton
  if (isLoading && tasks.length === 0) {
    return (
      <View style={styles.container}>
        <Image
          source={headerWave}
          style={styles.headerWave}
          resizeMode="cover"
        />
        <View style={styles.welcomeSection}>
          <Text style={styles.date}>{today}</Text>
          <Text style={styles.greeting}>
            Welcome Back, {driver?.first_name || ''}
          </Text>
        </View>
        <TaskListSkeleton count={3} />
      </View>
    );
  }

  // Parallax scroll
  const scrollY = useSharedValue(0);
  const prevTab = useRef(activeTab);
  const tabDirection = useRef<'left' | 'right'>('right');

  if (prevTab.current !== activeTab) {
    tabDirection.current = activeTab === 'completed' ? 'left' : 'right';
    prevTab.current = activeTab;
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, 200], [0, -60], 'clamp'),
      },
      {
        scale: interpolate(scrollY.value, [-100, 0], [1.3, 1], 'clamp'),
      },
    ],
  }));

  const profileStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 80], [1, 0], 'clamp'),
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, 80], [0, -20], 'clamp'),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Header wave background with parallax */}
      <Animated.Image
        source={headerWave}
        style={[styles.headerWave, headerStyle]}
        resizeMode="cover"
      />

      {/* Profile icon with fade */}
      <Animated.View style={[styles.profileCircle, profileStyle]}>
        <Text style={styles.profileLetter}>{driver?.first_name?.[0]}</Text>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        scrollEnabled={!quickActionsVisible && !confirmModalVisible}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primaryGreen]}
            tintColor={Colors.primaryGreen}
          />
        }
      >
        {/* Welcome section */}
        <Animated.View
          entering={FadeIn.duration(500)}
          style={styles.welcomeSection}
        >
          <Text style={styles.date}>{today}</Text>
          <Text style={styles.greeting}>
            Welcome Back, {driver?.first_name || ''}
          </Text>
          <Text style={styles.subtext}>
            You have <Text style={styles.subtextBold}>{activeCount} tasks</Text>{' '}
            in progress today
          </Text>
        </Animated.View>

        {/* Tab navigation */}
        <UnderlineTabBar
          tabs={[
            { key: 'active', label: `Active (${activeCount})` },
            { key: 'completed', label: 'Completed' },
          ]}
          activeKey={activeTab}
          onChange={setActiveTab}
        />

        {/* Filter row */}
        <Pressable style={styles.filterRow}>
          <Text style={styles.filterText}>filter</Text>
        </Pressable>

        {/* Error message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorHint}>Pull down to retry</Text>
          </View>
        )}

        {/* Task cards with tab transition */}
        <Animated.View
          key={activeTab}
          entering={
            tabDirection.current === 'left'
              ? FadeInLeft.duration(250).springify().damping(20)
              : FadeInRight.duration(250).springify().damping(20)
          }
          exiting={FadeOut.duration(150)}
          style={styles.taskListContainer}
        >
          {displayedTasks.length > 0 ? (
            displayedTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                locationName={task.location_name || 'Unknown Location'}
                address={formatAddress(task)}
                timeRange={formatTimeRange(task.start_time, task.end_time)}
                status={task.derivedStatus}
                completedDate={formatStatusDate(task)}
                index={index}
                onPress={() => handleCardPress(task)}
                onLongPress={() => handleCardLongPress(task)}
              />
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Image
                source={elementIcon}
                style={styles.emptyIcon}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>
                {activeTab === 'active'
                  ? 'You have no active tasks'
                  : 'No completed tasks yet'}
              </Text>
              {activeTab === 'active' && (
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => router.replace('/(tabs)/available-pick-ups')}
                >
                  <Text style={styles.emptyButtonText}>Add Task</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </Animated.View>
      </Animated.ScrollView>

      {/* Quick Actions Bottom Sheet */}
      <QuickActionsSheet
        visible={quickActionsVisible}
        onClose={handleCloseQuickActions}
        onMarkDelivered={handleMarkDelivered}
        onMarkMissing={handleMarkMissingPrompt}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={confirmModalVisible}
        title="Mark task as missing?"
        subtitle="This task will be removed."
        onBack={handleCancelMissing}
        onConfirm={handleConfirmMissing}
      />
    </View>
  );
}
