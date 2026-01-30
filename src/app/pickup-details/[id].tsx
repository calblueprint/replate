import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { BASE_URL } from '~/api/config';

import { fmtTime } from '@/utils/dateHelpers';
import { MOCK_PICKUPS } from '../available-pick-ups';
import { styles } from '../available-pick-ups/_styles/styles';

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.detailsSections}>
      <Text style={{ fontWeight: '700', marginBottom: 6 }}>{title}</Text>
      {children}
    </View>
  );
}

type TaskDetails = {
  id: number;
  pickup_date: string; // "2025-11-07"
  start_time: string | null; // "2025-11-07 14:00:00 UTC"
  end_time: string | null; // "2025-11-07 15:00:00 UTC"
  location_name: string | null; // "DEV DEMO — ..."
  address?: {
    number?: string | null;
    street?: string | null;
    apt_number?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    comments?: string | null; // building notes
  } | null;
  contact_name?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  description?: string | null;
};

function errToMsg(e: unknown): string {
  if (e instanceof Error) return e.message;
  return typeof e === 'string' ? e : 'Unknown error';
}

export default function PickupDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [task, setTask] = React.useState<TaskDetails | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setTask(null);
    setErr(null);

    (async () => {
      try {
        const token = Array.isArray(id) ? id[0] : id; // for arrays
        const url = `${BACKEND_URL}/api/tasks/${encodeURIComponent(token ?? '')}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();

        // handle object OR [object]
        const data: TaskDetails = Array.isArray(raw) ? raw[0] : raw;

        if (!cancelled) setTask(data);
      } catch (e: unknown) {
        if (!cancelled) setErr(errToMsg(e));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (err) {
    return (
      <View style={styles.view}>
        <Text>Failed to load: {err}</Text>
      </View>
    );
  }
  if (!task) {
    return <ActivityIndicator style={{ marginTop: 32 }} />;
  }

  const addr = task.address ?? null;
  const line1 = [addr?.number, addr?.street].filter(Boolean).join(' ');
  const line2 = [addr?.apt_number].filter(Boolean).join(' ');
  const line3 = [addr?.city, addr?.state].filter(Boolean).join(', ');
  const line4 = [addr?.zip].filter(Boolean).join(' ');
  const comments = addr?.comments || null;

  return (
    <View style={styles.view}>
      <Section title="Pickup Location">
        <Text>{task.location_name ?? '—'}</Text>
      </Section>

      <Section title="Pickup ID">
        <Text>{task.id}</Text>
      </Section>

      <Section title="Pickup Date">
        <Text>{task.pickup_date}</Text>
      </Section>

      <Section title="Time Window">
        <Text>
          {task.start_time} — {task.end_time}
        </Text>
      </Section>

      <Section title="Address">
        {line1 ? <Text>{line1}</Text> : null}
        {line2 ? <Text>{line2}</Text> : null}
        {line3 ? <Text>{line3}</Text> : null}
        {line4 ? <Text>{line4}</Text> : null}
        {!line1 && !line2 && !line3 && !line4 ? <Text>—</Text> : null}
        {comments ? (
          <Text style={{ marginTop: 6, color: '#374151' }}>{comments}</Text>
        ) : null}
      </Section>

      <Section title="Onsite Contact">
        <Text>Name: {task.contact_name ?? '—'}</Text>
        <Text>Phone: {task.contact_phone ?? '—'}</Text>
        <Text>Email: {task.contact_email ?? '—'}</Text>
      </Section>

      <Section title="Description / Notes">
        <Text>{task.description ?? '—'}</Text>
      </Section>
    </View>
  );
}
