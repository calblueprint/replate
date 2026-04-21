import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import headerWave from 'assets/header-wave.png';
import AvailableTaskCard from '@/components/AvailableTaskCard';
import DayCarousel from '@/components/DayCarousel';
import Colors from '@/styles/colors';
import { useAuth } from '@/utils/AuthContext';
import { ApiError, apiRequest, validateArrayResponse } from '~/api/apiUtils';
import { API_ENDPOINTS, BASE_URL } from '~/api/config';
import { styles } from '../../styles/tabs/available-pick-ups-styles';

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

function localISODate(d: Date): string {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function formatTimeRange(
  dateISO: string,
  startTime: string | null,
  endTime: string | null,
): string {
  if (!startTime || !endTime) return 'Time TBD';

  const parseTime = (timeStr: string) => {
    // Handle "HH:MM" format
    if (/^\d{2}:\d{2}$/.test(timeStr)) {
      const [hours, minutes] = timeStr.split(':').map(n => parseInt(n, 10));
      if (isNaN(hours) || isNaN(minutes)) return null;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${displayHours}:${displayMinutes} ${ampm}`;
    }
    // Handle full datetime strings
    const d = new Date(
      timeStr.includes('T') ? timeStr : `${dateISO}T${timeStr}`,
    );
    if (isNaN(d.getTime())) return null;
    const h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr12 = h % 12 || 12;
    return `${hr12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const start = parseTime(startTime);
  const end = parseTime(endTime);
  if (!start || !end) return 'Time TBD';
  return `${start} - ${end}`;
}

function formatAddress(task: ApiTask): string {
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
    return 'Bay Area, CA';
  }
  return 'Address details in app';
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

  const filteredTasks = useMemo(
    () => tasks.filter(t => t.pickup_date === selectedDate),
    [tasks, selectedDate],
  );

  if (isLoading && tasks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primaryGreen} />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header wave */}
      <Image source={headerWave} style={styles.headerWave} resizeMode="cover" />

      {/* Profile icon */}
      <View style={styles.profileCircle}>
        <Text style={styles.profileLetter}>{driver?.first_name?.[0]}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primaryGreen]}
            tintColor={Colors.primaryGreen}
          />
        }
      >
        {/* Page title */}
        <Text style={styles.pageTitle}>Today's Available Tasks</Text>

        {/* Day carousel */}
        <DayCarousel
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Section title */}
        <Text style={styles.sectionTitle}>Available Pick-Ups</Text>

        {/* Error */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorHint}>Pull down to retry</Text>
          </View>
        )}

        {/* Task cards */}
        <View style={styles.taskList}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <AvailableTaskCard
                key={task.encrypted_id}
                locationName={task.location_name ?? 'Unknown Location'}
                address={formatAddress(task)}
                timeRange={formatTimeRange(
                  task.pickup_date,
                  task.start_time,
                  task.end_time,
                )}
                index={index}
                onPress={() =>
                  router.push({
                    pathname: '/pickup-details/[id]',
                    params: { id: task.encrypted_id },
                  })
                }
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No pickups available for this date.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
