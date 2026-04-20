import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import elementIcon from 'assets/elements.png';
import { ApiError, apiRequest, validateArrayResponse } from '~/api/apiUtils';
import { API_ENDPOINTS, BASE_URL } from '~/api/config';
import styles from '../../styles/tabs/my-tasks-styles';
import { useAuth } from '../../utils/AuthContext';

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

function formatTimeRange(
  startTime: string | null,
  endTime: string | null,
): string {
  if (!startTime || !endTime) return 'Time TBD';

  try {
    // Parse time strings like "09:00" or "14:30"
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
  // If we have address data from API, use it
  if (task.address) {
    const { street, city, state, zip } = task.address;
    const parts = [];

    if (street) parts.push(street);
    if (city) parts.push(city);
    if (state) parts.push(state);
    if (zip) parts.push(zip);

    if (parts.length > 0) {
      return parts.join(', ');
    }
  }

  // Fallback to location name parsing
  if (task.location_name) {
    // Return a generic Oakland/Berkeley address based on the location name
    if (task.location_name.includes('Oakland')) {
      return 'Oakland, CA';
    } else if (task.location_name.includes('Berkeley')) {
      return 'Berkeley, CA';
    } else if (
      task.location_name.includes('San Francisco') ||
      task.location_name.includes('SF')
    ) {
      return 'San Francisco, CA';
    } else if (task.location_name.includes('San Jose')) {
      return 'San Jose, CA';
    }
    return 'Bay Area, CA';
  }

  return 'Address details in app';
}

export default function MyTasksPage() {
  const router = useRouter();
  const { driver } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
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
    fetchTasks(true);
  }, [fetchTasks]);

  const hasTasks = tasks.length > 0;

  // Show loading indicator on initial load
  if (isLoading && tasks.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#58ad85" />
        <Text style={{ marginTop: 12, color: '#6b7280' }}>
          Loading your tasks...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={['#58ad85']}
          tintColor="#58ad85"
        />
      }
    >
      {/* HEADER SECTION */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <Text style={styles.date}>{today}</Text>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>
              {(driver?.first_name || '?')[0]}
            </Text>
          </View>
        </View>
        <Text style={styles.greeting}>
          Welcome Back, {driver?.first_name || 'Driver'}
        </Text>
        <Text style={styles.subtext}>
          You have <Text style={styles.bold}>{tasks.length} tasks</Text> in
          progress
        </Text>
      </View>

      {/* ERROR MESSAGE */}
      {error && (
        <View
          style={{
            backgroundColor: '#fee2e2',
            padding: 12,
            marginHorizontal: 20,
            marginBottom: 16,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#991b1b' }}>{error}</Text>
          <Text style={{ color: '#6b7280', marginTop: 4, fontSize: 12 }}>
            Pull down to retry
          </Text>
        </View>
      )}

      {/* TASKS SECTION */}
      <View style={styles.taskSection}>
        {hasTasks ? (
          <>
            <Text style={styles.sectionHeader}>TASKS ({tasks.length})</Text>
            {tasks.map(task => (
              <View key={task.id} style={styles.card}>
                <View style={styles.cardAccent} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>
                    Pickup from {task.location_name || 'Unknown Location'}
                  </Text>
                  <Text style={styles.cardAddress}>{formatAddress(task)}</Text>
                  <Text style={styles.cardTime}>
                    {formatTimeRange(task.start_time, task.end_time)}
                  </Text>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonOutline]}
                      onPress={() =>
                        router.push({
                          pathname: '/pickup-details/[id]',
                          params: {
                            id: task.encrypted_id,
                            location: task.location_name ?? '',
                          },
                        })
                      }
                    >
                      <Text
                        style={[styles.buttonText, styles.buttonOutlineText]}
                      >
                        View pickup details
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.button, styles.buttonFilled]}
                      onPress={() =>
                        router.push({
                          pathname: '/donation-details/[id]',
                          params: {
                            id: task.encrypted_id,
                            location: task.location_name ?? '',
                          },
                        })
                      }
                    >
                      <Text
                        style={[styles.buttonText, styles.buttonFilledText]}
                      >
                        Enter donation details
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Image
              source={elementIcon}
              style={styles.emptyIcon}
              resizeMode="contain"
            />

            <Text style={styles.emptyTitle}>You have no new tasks</Text>

            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.replace('/(tabs)/available-pick-ups')}
            >
              <Text style={styles.emptyButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
