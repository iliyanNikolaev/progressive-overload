
import { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

import {
  getExercises,
  getWorkoutExercises,
  addExerciseToWorkout,
  getLastExercisePerformance,
  finishWorkout,
} from '../database/database';

import WorkoutExerciseCard from '../components/WorkoutExerciseCard';

export default function WorkoutScreen({ route, navigation }) {
  const { workoutId } = route.params;

  const [exercises, setExercises] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [showExerciseList, setShowExerciseList] = useState(false);

  function loadData() {
    const allExercises = getExercises();
    const currentExercises = getWorkoutExercises(workoutId);

    setExercises(allExercises);
    setWorkoutExercises(currentExercises);
  }

  useEffect(() => {
    loadData();
  }, [workoutId]);

  function handleAddExercise(exercise) {
    const alreadyAdded = workoutExercises.some(
      (item) => item.exercise_id === exercise.id
    );

    if (alreadyAdded) {
      return;
    }

    addExerciseToWorkout(workoutId, exercise.id);

    loadData();
    setShowExerciseList(false);
  }

  function handleFinishWorkout() {
    if (workoutExercises.length === 0) {
      Alert.alert(
        'Няма упражнения',
        'Добави поне едно упражнение преди да приключиш тренировката.'
      );
      return;
    }

    Alert.alert(
      'Приключване на тренировка',
      'Сигурен ли си, че искаш да приключиш тази тренировка?',
      [
        {
          text: 'Отказ',
          style: 'cancel',
        },
        {
          text: 'Приключи',
          onPress: () => {
            finishWorkout(workoutId);

            navigation.navigate('MainTabs', {
              screen: 'Home',
            });
          },
        },
      ]
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
        style={styles.addExerciseButton}
        onPress={() => setShowExerciseList(!showExerciseList)}
      >
        <Text style={styles.addExerciseButtonText}>
          {showExerciseList
            ? 'Затвори списъка'
            : '+ Добави упражнение'}
        </Text>
      </Pressable>

      {showExerciseList && (
        <View style={styles.exerciseList}>

          <Text style={styles.sectionTitle}>
            Избери упражнение
          </Text>

          {exercises.length === 0 ? (
            <Text style={styles.emptyText}>
              Все още нямаш добавени упражнения в каталога.
            </Text>
          ) : (
            exercises.map((exercise) => {
              const alreadyAdded = workoutExercises.some(
                (item) => item.exercise_id === exercise.id
              );

              return (
                <Pressable
                  key={exercise.id}
                  style={[
                    styles.exerciseOption,
                    alreadyAdded && styles.disabledExercise,
                  ]}
                  onPress={() => handleAddExercise(exercise)}
                  disabled={alreadyAdded}
                >
                  <Text style={styles.exerciseOptionText}>
                    {exercise.name}
                  </Text>

                  {alreadyAdded && (
                    <Text style={styles.addedText}>
                      Добавено
                    </Text>
                  )}
                </Pressable>
              );
            })
          )}

        </View>
      )}

      <FlatList
        data={workoutExercises}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderWorkoutExercise}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Все още няма добавени упражнения.
          </Text>
        }
      />

      <Pressable
        style={styles.finishButton}
        onPress={handleFinishWorkout}
      >
        <Text style={styles.finishButtonText}>
          Приключи тренировка
        </Text>
      </Pressable>

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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },

  addExerciseButton: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },

  addExerciseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  exerciseList: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
  },

  exerciseOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  exerciseOptionText: {
    fontSize: 15,
    color: '#111827',
  },

  disabledExercise: {
    opacity: 0.5,
  },

  addedText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '600',
  },

  listContent: {
    paddingBottom: 20,
  },

  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 20,
  },

  finishButton: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  finishButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});
