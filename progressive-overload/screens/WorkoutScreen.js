
import { useEffect, useState } from 'react';

import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';

import {
  getExercises,
  addExerciseToWorkout,
  getWorkoutExercises,
  getLastExercisePerformance,
} from '../database/database';

import WorkoutExerciseCard from '../components/WorkoutExerciseCard';

export default function WorkoutScreen({ route }) {
  const { workoutId } = route.params;

  const [exercises, setExercises] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [showCatalog, setShowCatalog] = useState(false);

  function loadExercises() {
    setExercises(getExercises());
  }

  function loadWorkoutExercises() {
    setWorkoutExercises(getWorkoutExercises(workoutId));
  }

  useEffect(() => {
    loadExercises();
    loadWorkoutExercises();
  }, [workoutId]);

  function handleAddExercise(exercise) {
    const alreadyAdded = workoutExercises.some(
      (item) => item.exercise_id === exercise.id
    );

    if (alreadyAdded) {
      return;
    }

    addExerciseToWorkout(workoutId, exercise.id);

    loadWorkoutExercises();
    setShowCatalog(false);
  }

  function renderCatalogExercise({ item }) {
    const alreadyAdded = workoutExercises.some(
      (exercise) => exercise.exercise_id === item.id
    );

    return (
      <Pressable
        style={styles.catalogItem}
        onPress={() => handleAddExercise(item)}
        disabled={alreadyAdded}
      >
        <Text style={styles.catalogName}>
          {item.name}
        </Text>

        <Text style={styles.addText}>
          {alreadyAdded ? 'Добавено' : '+ Добави'}
        </Text>
      </Pressable>
    );
  }

  function renderWorkoutExercise({ item }) {
    const previousSets = getLastExercisePerformance(
      item.exercise_id,
      workoutId
    );

    return (
      <WorkoutExerciseCard
        item={item}
        previousSets={previousSets}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Текуща тренировка
      </Text>

      <Pressable
        style={styles.addButton}
        onPress={() => setShowCatalog(!showCatalog)}
      >
        <Text style={styles.addButtonText}>
          {showCatalog ? 'Затвори каталога' : '+ Добави упражнение'}
        </Text>
      </Pressable>

      {showCatalog && (
        <View style={styles.catalogContainer}>
          <Text style={styles.sectionTitle}>
            Избери упражнение
          </Text>

          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCatalogExercise}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Все още няма упражнения в каталога.
              </Text>
            }
          />
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Упражнения ({workoutExercises.length})
      </Text>

      <FlatList
        data={workoutExercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderWorkoutExercise}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Тренировката е празна. Добави първото си упражнение.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  catalogContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    maxHeight: 280,
  },
  catalogItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  catalogName: {
    fontSize: 15,
  },
  addText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});
