
import { useCallback, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  createWorkout,
  getActiveWorkout,
} from '../database/database';

export default function HomeScreen({ navigation }) {
  const [activeWorkout, setActiveWorkout] = useState(null);

  // Проверяваме за активна тренировка при отваряне на Home екрана
  useFocusEffect(
    useCallback(() => {
      const workout = getActiveWorkout();
      setActiveWorkout(workout);
    }, [])
  );

  function startWorkout() {
    // Проверяваме отново базата данни преди навигацията
    const workout = getActiveWorkout();

    const workoutId = workout
      ? workout.id
      : createWorkout();

    navigation.navigate('Workout', {
      workoutId: workoutId,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Дневник прогресивно претоварване
      </Text>

      <Pressable
        style={styles.button}
        onPress={startWorkout}
      >
        <Text style={styles.buttonText}>
          {activeWorkout
            ? 'Продължи тренировка'
            : 'Започни тренировка'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 24,
    paddingTop: 70,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#2563eb',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
