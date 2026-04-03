import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import historyStyles from '../../styles/tabs/history-styles';

/**
 * Placeholder rows until Sprint 3 API. Later: missed/other statuses, red accents, etc.
 */
type HistoryCardItem = {
  id: string;
  pickupLocation: string;
  npoRecipient: string;
};

type HistoryDateGroup = {
  dateHeader: string;
  items: HistoryCardItem[];
};

/** Card accent + status label — all completed/green for now */
const CARD_ACCENT_GREEN = '#71C79F';
const STATUS_TEXT_GREEN = '#2D8A60';

const PLACEHOLDER_GROUPS: HistoryDateGroup[] = [
  {
    dateHeader: '28 October, 2025',
    items: [
      {
        id: 'h1',
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
            {group.items.map(item => (
              <View key={item.id} style={historyStyles.card}>
                <View
                  style={[
                    historyStyles.cardAccent,
                    { backgroundColor: CARD_ACCENT_GREEN },
                  ]}
                />
                <View style={historyStyles.cardContent}>
                  <View style={historyStyles.cardTopRow}>
                    <Text
                      style={[
                        historyStyles.statusText,
                        { color: STATUS_TEXT_GREEN },
                      ]}
                    >
                      Completed
                    </Text>
                  </View>

                  <Text style={historyStyles.fieldLabel}>Pickup location</Text>
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
            ))}
          </View>
        ))
      )}
    </View>
  );
}
