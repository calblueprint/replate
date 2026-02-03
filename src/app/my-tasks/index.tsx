import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import elementIcon from 'assets/elements.png';
import { useAuth } from '../../utils/AuthContext';
import styles from './styles';

type Task = {
  id: number;
  location: string;
  address: string;
  time: string;
};
const MOCK_TASKS: Task[] = [];

export default function MyTasksPage() {
  const router = useRouter();
  const { driver } = useAuth();
  const tasks = MOCK_TASKS;
  const hasTasks = tasks.length > 0;
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER SECTION */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <Text style={styles.date}>{today}</Text>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{driver?.first_name[0]}</Text>
          </View>
        </View>
        <Text style={styles.greeting}>
          Welcome Back, {driver?.first_name || ''}
        </Text>
        <Text style={styles.subtext}>
          You have <Text style={styles.bold}>{tasks.length} tasks</Text> in
          progress today
        </Text>
      </View>

      {/* TASKS SECTION */}
      <View style={styles.taskSection}>
        {hasTasks ? (
          <>
            <Text style={styles.sectionHeader}>TODAY ({tasks.length})</Text>
            {tasks.map(task => (
              <View key={task.id} style={styles.card}>
                <View style={styles.cardAccent} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>
                    Pickup from {task.location}
                  </Text>
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
                      <Text
                        style={[styles.buttonText, styles.buttonOutlineText]}
                      >
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
              onPress={() => router.push('/available-pick-ups')}
            >
              <Text style={styles.emptyButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
