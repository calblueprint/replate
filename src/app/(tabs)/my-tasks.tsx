import React, { useCallback, useEffect, useState } from 'react';
import { Image, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import elementIcon from 'assets/elements.png';
import AnimatedEntry from '@/components/AnimatedEntry';
import AnimatedPressable from '@/components/AnimatedPressable';
import PageHeader from '@/components/PageHeader';
import TaskCard, { TaskCardSkeleton } from '@/components/TaskCard';
import colors from '@/styles/colors';
import { useAuth } from '@/utils/AuthContext';
import { ApiError, apiRequest, validateArrayResponse } from '~/api/apiUtils';
import { API_ENDPOINTS, BASE_URL } from '~/api/config';

type Task = {
  id: number;
  encrypted_id: string;
  pickup_date: string;
  start_time: string | null;
  end_time: string | null;
  location_name: string | null;
  address?: {
    number?: string | null;
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
  } | null;
};

export default function MyTasksPage() {
  const router = useRouter();
  const { driver } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

        const data = await apiRequest<Task[]>(
          `${BASE_URL}${API_ENDPOINTS.MY_TASKS}?driver_id=${driver.id}`,
          { method: 'GET', validateResponse: validateArrayResponse },
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
    void fetchTasks(true);
  }, [fetchTasks]);

  const hasTasks = tasks.length > 0;

  if (isLoading && tasks.length === 0) {
    return (
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <PageHeader
          title={`Welcome Back, ${driver?.first_name || ''}`}
          subtitle="Loading your tasks..."
          driverName={driver?.first_name}
        />
        <View className="px-5 pt-6">
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary[400]]}
          tintColor={colors.primary[400]}
        />
      }
    >
      <PageHeader
        title={`Welcome Back, ${driver?.first_name || ''}`}
        subtitle={`You have ${tasks.length} tasks in progress today`}
        driverName={driver?.first_name}
      />

      {error && (
        <View
          className="bg-error-light p-3 mx-5 mt-4 rounded-lg"
          accessibilityLiveRegion="polite"
        >
          <Text className="text-error-dark font-body">{error}</Text>
          <Text className="text-neutral-500 mt-1 text-xs font-body">
            Pull down to retry
          </Text>
        </View>
      )}

      <View className="px-5 pt-6 pb-8">
        {hasTasks ? (
          <>
            <Text className="text-xs text-neutral-600 mb-4 font-label tracking-wider">
              TODAY ({tasks.length})
            </Text>
            {tasks.map((task, index) => (
              <AnimatedEntry key={task.id} delay={index * 80}>
                <TaskCard
                  task={task}
                  onViewDetails={() =>
                    router.push({
                      pathname: '/pickup-details/[id]',
                      params: {
                        id: task.encrypted_id,
                        location: task.location_name ?? '',
                      },
                    })
                  }
                />
              </AnimatedEntry>
            ))}
          </>
        ) : (
          <View className="flex-1 items-center justify-center py-16">
            <AnimatedEntry from={{ opacity: 0, scale: 0.8 }} duration={500}>
              <Image
                source={elementIcon}
                className="w-36 h-36 mb-6"
                resizeMode="contain"
                accessibilityLabel="No tasks illustration"
              />
            </AnimatedEntry>

            <Text className="text-base font-subheading text-neutral-500 text-center mb-2">
              No tasks yet
            </Text>
            <Text className="text-sm font-body text-neutral-500 text-center mb-8 px-8">
              Browse available pickups to get started
            </Text>

            <AnimatedPressable
              className="px-8 rounded-xl bg-primary-400 items-center justify-center self-center shadow-sm min-h-[48px] py-3"
              onPress={() => router.replace('/(tabs)/available-pick-ups')}
              accessibilityRole="button"
              accessibilityLabel="Add task"
            >
              <Text className="text-white text-base font-subheading text-center">
                Add Task
              </Text>
            </AnimatedPressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
