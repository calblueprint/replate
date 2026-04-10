import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import historyStyles from '../../styles/tabs/history-styles';

/**
 * Placeholder rows until Sprint 3 API. Amber accent matches in-progress overdue cards
 * (`my-tasks` `isOverdue`): pickup_date before today and task not complete.
 */
type HistoryCardItem = {
  id: string;
  pickupDate: string; // YYYY-MM-DD
  /** Mirrors API: complete when pickup has an end time / finished flow */
  isComplete: boolean;
  pickupLocation: string;
  npoRecipient: string;
};

type HistoryDateGroup = {
  dateHeader: string;
  items: HistoryCardItem[];
};

const CARD_ACCENT_GREEN = '#58AD85';
const CARD_ACCENT_YELLOW = '#DBBC55'; // same as `my-tasks-styles` cardAccentOverdue
const STATUS_TEXT_GREEN = '#58AD85';
const STATUS_TEXT_YELLOW = '#DBBC55';

function isPastPickupNotComplete(item: HistoryCardItem): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pickup = new Date(`${item.pickupDate}T00:00:00`);
  if (isNaN(pickup.getTime())) return false;
  return pickup.getTime() < today.getTime() && !item.isComplete;
}

const PLACEHOLDER_GROUPS: HistoryDateGroup[] = [
  {
    dateHeader: '28 October, 2025',
    items: [
      {
        id: 'h1',
        pickupDate: '2025-10-28',
        isComplete: true,
        pickupLocation: 'Rockridge Cafe',
        npoRecipient: 'Hollywood Food Coalition (HFC)',
      },
    ],
  },
  {
    dateHeader: '25 October, 2025',
    items: [
      {
        id: 'h2',
        pickupDate: '2025-10-25',
        isComplete: false,
        pickupLocation: 'Strada Cafe',
        npoRecipient: 'Denver Food Rescue (DFR)',
      },
    ],
  },
  {
    dateHeader: '23 October, 2025',
    items: [
      {
        id: 'h3',
        pickupDate: '2025-10-23',
        isComplete: true,
        pickupLocation: 'Chipotle',
        npoRecipient: 'Rescuing Leftover Cuisine (RLC)',
      },
    ],
  },
];

/** Set to true to preview empty state layout */
const SHOW_EMPTY_STATE = false;

/**
 * History list for Home — imported by `my-tasks.tsx` when the In Progress / History
 * toggle is on History (placeholder data until Sprint 3).
 *
 * This file lives under `(tabs)` for sprint organization. It is registered as a
 * hidden tab route (`href: null` in `_layout.tsx`) so it does not add a tab bar item.
 */
export default function HistoryHomeContent() {
  const groups = SHOW_EMPTY_STATE ? [] : PLACEHOLDER_GROUPS;

  return (
    <View style={historyStyles.taskSection}>
      {groups.length === 0 ? (
        <View style={historyStyles.emptyStateContainer}>
          <Text style={historyStyles.emptyTitle}>
            No history yet. Completed and missed pickups will appear here.
          </Text>
        </View>
      ) : (
        groups.map(group => (
          <View key={group.dateHeader}>
            <Text style={historyStyles.dateGroupHeader}>
              {group.dateHeader}
            </Text>
            {group.items.map(item => {
              const showAmber = isPastPickupNotComplete(item);
              const accentColor = showAmber
                ? CARD_ACCENT_YELLOW
                : CARD_ACCENT_GREEN;
              const statusColor = showAmber
                ? STATUS_TEXT_YELLOW
                : STATUS_TEXT_GREEN;
              const statusLabel = showAmber ? 'Missed' : 'Completed';

              return (
                <View key={item.id} style={historyStyles.card}>
                  <View
                    style={[
                      historyStyles.cardAccent,
                      { backgroundColor: accentColor },
                    ]}
                  />
                  <View style={historyStyles.cardContent}>
                    <View style={historyStyles.cardTopRow}>
                      <Text
                        style={[
                          historyStyles.statusText,
                          { color: statusColor },
                        ]}
                      >
                        {statusLabel}
                      </Text>
                    </View>

                    <Text style={historyStyles.fieldLabel}>
                      Pickup location
                    </Text>
                    <Text style={historyStyles.fieldValue}>
                      {item.pickupLocation}
                    </Text>

                    <Text style={historyStyles.fieldLabel}>NPO Recipient</Text>
                    <Text style={historyStyles.fieldValue}>
                      {item.npoRecipient}
                    </Text>

                    <TouchableOpacity
                      style={historyStyles.buttonFullWidth}
                      activeOpacity={0.85}
                      onPress={() => {
                        /* Sprint 3: navigate with task id */
                      }}
                    >
                      <Text style={historyStyles.buttonFullWidthText}>
                        Edit donation details
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ))
      )}
    </View>
  );
}
