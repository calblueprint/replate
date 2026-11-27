import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, RefreshControl, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import elementIcon from 'assets/elements.png';
import { z } from 'zod';
import AvailableTaskCard from '@/components/AvailableTaskCard';
import DayCarousel from '@/components/DayCarousel';
import { AvailableListSkeleton } from '@/components/SkeletonLoader';
import Colors from '@/styles/colors';
import { styles } from '@/styles/tabs/available-pick-ups-styles';
import { useAuth } from '@/utils/AuthContext';
import { formatTimeRangeAny, localISODate } from '@/utils/dateHelpers';
import { formatTaskAddress } from '@/utils/taskHelpers';
import { ApiError, apiRequest } from '~/api/apiUtils';
import { API_ENDPOINTS, BASE_URL } from '~/api/config';

const TaskArraySchema = z.array(z.unknown());

interface ApiTask {
  id: number;
  encrypted_id: string;
  pickup_date: string;
  start_time: string | null;
  end_time: string | null;
  location_name: string | null;
  address?: {
    street?: string | null;
    city?: string | null;
    state?: string | null;
  } | null;
}

export default function AvailablePickupsPage() {
  const todayISO = localISODate(new Date());
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { driver } = useAuth();

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

        const data = await apiRequest<ApiTask[]>(
          `${BASE_URL}${API_ENDPOINTS.TASKS}?driver_id=${driver.id}`,
          { method: 'GET', schema: TaskArraySchema },
        );

        setTasks(data);
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

  const filteredTasks = useMemo(
    () => tasks.filter(t => t.pickup_date === selectedDate),
    [tasks, selectedDate],
  );

  if (isLoading && tasks.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Today's Available Tasks</Text>
        </View>
        <DayCarousel
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          dayCount={5}
        />
        <AvailableListSkeleton count={4} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed white header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Today's Available Tasks</Text>
      </View>
      <DayCarousel
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        dayCount={5}
      />

      {/* Scrollable content */}
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
        <Text style={styles.sectionTitle}>Available Pick-Ups</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorHint}>Pull down to retry</Text>
          </View>
        )}

        {filteredTasks.length > 0 ? (
          <View style={styles.taskList}>
            {filteredTasks.map(task => (
              <AvailableTaskCard
                key={task.encrypted_id}
                locationName={task.location_name ?? 'Unknown Location'}
                address={formatTaskAddress(task)}
                timeRange={formatTimeRangeAny(task.start_time, task.end_time, {
                  fallbackDateISO: task.pickup_date,
                })}
                onPress={() =>
                  router.push({
                    pathname: '/pickup-details/[id]',
                    params: { id: task.encrypted_id },
                  })
                }
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Image
              source={elementIcon}
              style={styles.emptyIcon}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>There are no tasks today</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
