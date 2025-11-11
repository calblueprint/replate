import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './styles';

const MOCK_TASKS = [
  {
    id: 1,
    location: 'Rockridge Cafe',
    address: '5492 College Ave, Oakland',
    time: '09:00 - 10:00 AM',
  },
  {
    id: 2,
    location: 'Strada Cafe',
    address: '2430 Bancroft Way, Berkeley',
    time: '10:30 - 11:00 AM',
  },
  {
    id: 3,
    location: 'Chipotle',
    address: '2136 Oxford St, Berkeley',
    time: '12:00 - 12:30 PM',
  },
];

export default function MyTasksPage() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER SECTION */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <Text style={styles.date}>Monday, 12 October</Text>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>E</Text>
          </View>
        </View>

        <Text style={styles.greeting}>Welcome Back, Eric</Text>
        <Text style={styles.subtext}>
          You have <Text style={styles.bold}>3 tasks</Text> in progress today
        </Text>
      </View>

      {/* TASKS SECTION */}
      <View style={styles.taskSection}>
        <Text style={styles.sectionHeader}>TODAY ({MOCK_TASKS.length})</Text>

        {MOCK_TASKS.map(task => (
          <View key={task.id} style={styles.card}>
            <View style={styles.cardAccent} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Pickup from {task.location}</Text>
              <Text style={styles.cardAddress}>{task.address}</Text>
              <Text style={styles.cardTime}>{task.time}</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonOutline]}
                  onPress={() =>
                    router.push(
                      `/pickup-details/${task.id}?location=${task.location}`,
                    )
                  }
                >
                  <Text style={[styles.buttonText, styles.buttonOutlineText]}>
                    View pickup details
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.buttonFilled]}
                  onPress={() =>
                    router.push(
                      `/donation-details/${task.id}?location=${task.location}`,
                    )
                  }
                >
                  <Text style={[styles.buttonText, styles.buttonFilledText]}>
                    Enter donation details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
