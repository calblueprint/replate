import type { TaskStatus } from '@/components/TaskCard';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Ionicons from '@react-native-vector-icons/ionicons';
import elementIcon from 'assets/elements.png';
import { TaskListSkeleton } from '@/components/SkeletonLoader';
import TaskCard from '@/components/TaskCard';
import UnderlineTabBar from '@/components/UnderlineTabBar';
import Colors from '@/styles/colors';
import styles from '@/styles/tabs/my-tasks-styles';
import { useAuth } from '@/utils/AuthContext';
import {
  formatShortStatusDate,
  formatTimeRangeAny,
  isTaskBeforeTodayPT,
  isTaskPastEndTime,
} from '@/utils/dateHelpers';
import { formatTaskAddress } from '@/utils/taskHelpers';
import { ApiError, apiRequest, validateArrayResponse } from '~/api/apiUtils';
import { API_ENDPOINTS, BASE_URL } from '~/api/config';

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

function deriveTaskStatus(task: Task): TaskStatus {
  if (task.status === 'complete' || task.completed_at) return 'completed';
  if (task.status === 'failed') return 'missed';

  if (isTaskPastEndTime(task.pickup_date, task.end_time)) return 'overdue';
  return 'active';
}

function formatStatusDate(
  task: Task & { derivedStatus?: TaskStatus },
): string | undefined {
  if (task.derivedStatus === 'overdue') {
    return isTaskBeforeTodayPT(task.pickup_date)
      ? formatShortStatusDate(task.pickup_date)
      : undefined;
  }

  const dateStr = task.completed_at ?? task.missed_at ?? task.pickup_date;
  if (!dateStr) return undefined;
  return formatShortStatusDate(dateStr);
}

export default function MyTasksPage() {
  const router = useRouter();
  const { driver } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('active');

  const now = new Date();
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNum = now.getDate();
  const monthName = now.toLocaleDateString('en-US', { month: 'long' });
  const today = `${weekday}, ${dayNum} ${monthName}`;

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

        const combined = new Map<number, Task>();
        for (const task of [...activeTasks, ...historyTasks]) {
          combined.set(task.id, task);
        }
        setTasks(Array.from(combined.values()));
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

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks]),
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchTasks(true);
  }, [fetchTasks]);

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

  const handleAddDetails = useCallback(
    (task: Task) => {
      router.push({
        pathname: '/donation-details/[id]',
        params: {
          id: task.encrypted_id,
          location: task.location_name ?? '',
        },
      });
    },
    [router],
  );

  if (isLoading && tasks.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.date}>{today}</Text>
          <Text style={styles.greeting}>
            Welcome Back, {driver?.first_name || ''}
          </Text>
          <Text style={styles.subtext}>
            You have <Text style={styles.subtextBold}>{activeCount} tasks</Text>{' '}
            in progress today
          </Text>
        </View>
        <TaskListSkeleton count={3} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed white header + tabs */}
      <View style={styles.header}>
        <Text style={styles.date}>{today}</Text>
        <Text style={styles.greeting}>
          Welcome Back, {driver?.first_name || ''}
        </Text>
        <Text style={styles.subtext}>
          You have <Text style={styles.subtextBold}>{activeCount} tasks</Text>{' '}
          in progress today
        </Text>
        <UnderlineTabBar
          tabs={[
            {
              key: 'active',
              label: activeCount > 0 ? `Active (${activeCount})` : 'Active',
            },
            { key: 'completed', label: 'History' },
          ]}
          activeKey={activeTab}
          onChange={setActiveTab}
        />
      </View>

      {/* Scrollable task list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primaryGreen]}
            tintColor={Colors.primaryGreen}
          />
        }
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorHint}>Pull down to retry</Text>
          </View>
        )}

        {displayedTasks.length > 0 ? (
          <View style={styles.taskListContainer}>
            {activeTab === 'completed' && (
              <Pressable style={styles.filterRow}>
                <Ionicons
                  name="filter-outline"
                  size={13}
                  color={Colors.filterGray}
                />
                <Text style={styles.filterText}>filter</Text>
              </Pressable>
            )}
            {displayedTasks.map(task => (
              <TaskCard
                key={task.id}
                locationName={task.location_name || 'Unknown Location'}
                address={formatTaskAddress(task)}
                timeRange={formatTimeRangeAny(task.start_time, task.end_time)}
                status={task.derivedStatus}
                completedDate={formatStatusDate(task)}
                onPress={() => handleCardPress(task)}
                onAddDetails={() => handleAddDetails(task)}
              />
            ))}
          </View>
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
                : 'No finished tasks yet'}
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
      </ScrollView>
    </View>
  );
}
