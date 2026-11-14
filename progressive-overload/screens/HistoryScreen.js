
import { useCallback, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useFocusEffect } from '@react-navigation/native';

import {
  getWorkoutHistory,
  getWorkoutExercises,
  getWorkoutSets,
} from '../database/database';

export default function HistoryScreen({ navigation }) {
  const [workouts, setWorkouts] = useState([]);

  function loadHistory() {
    const history = getWorkoutHistory() || [];

    const detailedHistory = history.map((workout) => {
      const exercises = getWorkoutExercises(workout.id) || [];

      const totalSets = exercises.reduce((total, exercise) => {
        const sets = getWorkoutSets(exercise.id) || [];
        return total + sets.length;
      }, 0);

      return {
        ...workout,
        exercises,
        totalSets,
      };
    });

    setWorkouts(detailedHistory);
  }

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  function formatDate(dateString) {
    const date = new Date(dateString.replace(' ', 'T') + 'Z');

    return date.toLocaleDateString('bg-BG', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  function renderWorkout({ item }) {
    return (
      <Pressable
        style={styles.workoutCard}
        onPress={() =>
          navigation.navigate('WorkoutDetails', {
            workoutId: item.id,
          })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.workoutTitle}>
            Тренировка
          </Text>

          <Text style={styles.completedLabel}>
            Завършена
          </Text>
        </View>

        <Text style={styles.workoutDate}>
          {formatDate(item.date)}
        </Text>

        <View style={styles.statsRow}>
          <Text style={styles.statText}>
            {(item.exercises || []).length} упражнения
          </Text>

          <Text style={styles.statText}>
            {item.totalSets} серии
          </Text>
        </View>

        <Text style={styles.exerciseNames} numberOfLines={2}>
          {(item.exercises || []).map((exercise) => exercise.name).join(' · ')}
        </Text>

        <Text style={styles.detailsText}>
          Натисни за подробности →
        </Text>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>История</Text>

      <FlatList
        data={workouts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderWorkout}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Все още нямаш приключени тренировки.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    marginTop: 8,
  },

  workoutCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },

  completedLabel: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '600',
  },

  workoutDate: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 6,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },

  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  exerciseNames: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 12,
    lineHeight: 20,
  },

  detailsText: {
    fontSize: 13,
    color: '#2563eb',
    marginTop: 14,
    fontWeight: '600',
  },

  listContent: {
    paddingBottom: 20,
  },

  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 30,
  },
});
