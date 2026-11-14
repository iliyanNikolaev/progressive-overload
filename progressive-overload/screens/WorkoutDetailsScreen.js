
import { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

import {
  getWorkoutExercises,
  getWorkoutSets,
} from '../database/database';

export default function WorkoutDetailsScreen({ route }) {
  const { workoutId } = route.params;

  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const workoutExercises = getWorkoutExercises(workoutId);

    const exercisesWithSets = workoutExercises.map((exercise) => ({
      ...exercise,
      sets: getWorkoutSets(exercise.id),
    }));

    setExercises(exercisesWithSets);
  }, [workoutId]);

  function renderExercise({ item }) {
    return (
      <View style={styles.exerciseCard}>
        <Text style={styles.exerciseName}>
          {item.name}
        </Text>

        {item.sets.length === 0 ? (
          <Text style={styles.emptyText}>
            Няма записани серии.
          </Text>
        ) : (
          item.sets.map((set) => (
            <View key={set.id} style={styles.setRow}>
              <Text style={styles.setText}>
                Серия {set.set_number}
              </Text>

              <Text style={styles.setText}>
                {set.reps} повторения
              </Text>

              <Text style={styles.setText}>
                {set.weight} кг
              </Text>
            </View>
          ))
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Детайли на тренировката</Text>

      <FlatList
        data={exercises}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderExercise}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Няма записани упражнения.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  setText: {
    fontSize: 14,
    color: '#374151',
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
});
