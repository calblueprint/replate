import React from 'react';
import { FlatList, Image, RefreshControl, Text, View } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import elementIcon from 'assets/elements.png';
import AnimatedEntry from '@/components/AnimatedEntry';
import AnimatedPressable from '@/components/AnimatedPressable';
import AnimatedSegmentedControl from '@/components/AnimatedSegmentedControl';
import PageHeader from '@/components/PageHeader';
import PickupCard, { PickupCardSkeleton } from '@/components/PickupCard';
import colors from '@/styles/colors';
import { useAuth } from '@/utils/AuthContext';
import { fmtDateHeader, localISODate } from '@/utils/dateHelpers';
import { safeJsonParse } from '@/utils/sanitization';
import { ApiError, apiRequest, validateArrayResponse } from '~/api/apiUtils';
import { API_ENDPOINTS, BASE_URL } from '~/api/config';

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  try {
    return JSON.stringify(e);
  } catch {
    return 'Unknown error';
  }
}

type ApiTask = {
  id: number;
  encrypted_id: string;
  pickup_date: string;
  start_time: string | null;
  end_time: string | null;
  location_name: string | null;
};

type UiPickup = {
  id: number;
  encrypted_id: string;
  pickup_date: string;
  slot_start_time: string | null;
  slot_end_time: string | null;
  pickup_location: string;
};

export default function AvailablePickupsPage() {
  const todayISO = localISODate(new Date());

  const tomorrowISO = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return localISODate(d);
  }, []);

  const [tab, setTab] = React.useState<'left' | 'right'>('left');
  const [selectedISO, setSelectedISO] = React.useState(todayISO);

  const [remote, setRemote] = React.useState<UiPickup[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const { driver } = useAuth();
  const driverId = driver?.id;

  const fetchTasks = React.useCallback(
    async (isRefresh = false) => {
      try {
        if (!isRefresh) setIsLoading(true);
        setError(null);

        const data = await apiRequest<ApiTask[]>(
          `${BASE_URL}${API_ENDPOINTS.TASKS}?driver_id=${driverId}`,
          { method: 'GET', validateResponse: validateArrayResponse },
        );

        const mapped: UiPickup[] = data.map(t => ({
          id: t.id,
          encrypted_id: t.encrypted_id,
          pickup_date: t.pickup_date,
          slot_start_time: t.start_time,
          slot_end_time: t.end_time,
          pickup_location: t.location_name ?? 'Unknown location',
        }));

        await AsyncStorage.setItem('tasks', JSON.stringify(mapped));
        setRemote(mapped);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : getErrorMessage(e));

        const saved = await AsyncStorage.getItem('tasks');
        if (saved) {
          const cached = safeJsonParse<UiPickup[]>(saved, []);
          if (Array.isArray(cached)) setRemote(cached);
        }
      } finally {
        setIsLoading(false);
        if (isRefresh) setIsRefreshing(false);
      }
    },
    [driverId],
  );

  React.useEffect(() => {
    if (!driverId) {
      setIsLoading(false);
      setError('Sign in required to view available tasks.');
      return;
    }

    fetchTasks();
  }, [driverId, fetchTasks]);

  const handleRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    void fetchTasks(true);
  }, [fetchTasks]);

  const source = remote ?? [];
  const filtered = React.useMemo(() => {
    return source.filter(p => p.pickup_date === selectedISO);
  }, [source, selectedISO]);

  if (isLoading && !remote) {
    return (
      <View className="flex-1 bg-background pt-0">
        <PageHeader
          title="Available Tasks"
          subtitle="Loading tasks..."
          driverName={driver?.first_name}
        />
        <View className="mt-2">
          <AnimatedSegmentedControl
            leftLabel="Today"
            rightLabel="Tomorrow"
            value={tab}
            onChange={value => {
              setTab(value);
              setSelectedISO(value === 'left' ? todayISO : tomorrowISO);
            }}
          />
        </View>
        <View className="mt-6 gap-3">
          <PickupCardSkeleton />
          <PickupCardSkeleton />
          <PickupCardSkeleton />
        </View>
      </View>
    );
  }

  if (!driverId) {
    return (
      <View className="flex-1 bg-background pt-0">
        <View className="flex-1 justify-center items-center p-6 gap-3">
          <Text className="text-base text-center font-body">
            Sign in required to view available tasks.
          </Text>
          <AnimatedPressable
            className="bg-primary-400 rounded-xl px-5 py-2.5 min-h-[48px] items-center justify-center"
            onPress={() => router.replace('/auth/login')}
            accessibilityRole="button"
          >
            <Text className="text-white font-subheading">Sign In</Text>
          </AnimatedPressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background pt-0">
      <FlatList
        data={filtered}
        keyExtractor={item => item.encrypted_id}
        contentContainerStyle={{ paddingBottom: 140 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary[400]]}
            tintColor={colors.primary[400]}
          />
        }
        ListHeaderComponent={
          <View>
            <PageHeader
              title="Available Tasks"
              subtitle={`${filtered.length} task${filtered.length === 1 ? '' : 's'} available`}
              driverName={driver?.first_name}
            />
            {error ? (
              <View
                className="p-4 bg-error-light rounded-lg mt-4 mx-5"
                accessibilityLiveRegion="polite"
              >
                <Text className="text-error-dark font-body">
                  Failed to load tasks: {error}
                </Text>
                <Text className="text-neutral-500 mt-1 text-xs font-body">
                  Pull down to retry
                </Text>
              </View>
            ) : null}
            <View className="mt-2">
              <AnimatedSegmentedControl
                leftLabel="Today"
                rightLabel="Tomorrow"
                value={tab}
                onChange={value => {
                  setTab(value);
                  setSelectedISO(value === 'left' ? todayISO : tomorrowISO);
                }}
              />
            </View>
            <Text className="mt-4 mb-4 mx-5 text-sm font-subheading text-neutral-700">
              {fmtDateHeader(selectedISO)}
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View className="h-4" />}
        renderItem={({ item, index }) => (
          <AnimatedEntry delay={index * 80}>
            <PickupCard
              task={item}
              onViewDetails={() => {
                router.push({
                  pathname: '/pickup-details/[id]',
                  params: { id: item.encrypted_id },
                });
              }}
            />
          </AnimatedEntry>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-16">
            <AnimatedEntry from={{ opacity: 0, scale: 0.8 }} duration={500}>
              <Image
                source={elementIcon}
                className="w-36 h-36 mb-6"
                resizeMode="contain"
                accessibilityLabel="No pickups illustration"
              />
            </AnimatedEntry>
            <Text className="text-base font-subheading text-neutral-500 mb-2">
              No pickups available
            </Text>
            <Text className="text-sm font-body text-neutral-500 text-center px-8">
              {tab === 'left'
                ? "Check back later or see tomorrow's pickups"
                : 'No pickups scheduled for tomorrow yet'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
