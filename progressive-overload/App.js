import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import {useState} from "react";

export default function App() {
  
  const [workoutStarted, setWorkoutStarted] = useState(false);

  function startWorkout() {
    setWorkoutStarted(true);
  };

  function finishWorkout() {
    setWorkoutStarted(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progressive Overload</Text>

      <Text style={styles.subtitle}>
        Track your progress
      </Text>

      
      {workoutStarted ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Тренировката е започнала!
          </Text>

          <Text style={styles.cardText}>
            Все още няма добавени упражнения.
          </Text>

          <Pressable
            style={styles.button}
            onPress={finishWorkout}
          >
            <Text style={styles.buttonText}>
              Завърши тренировката
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Няма активна тренировка
          </Text>

          <Pressable
            style={styles.button}
            onPress={startWorkout}
          >
            <Text style={styles.buttonText}>
              + Нова тренировка
            </Text>
          </Pressable>
        </View>
      )}


      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 24,
    paddingTop: 80,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#171717',
  },

  subtitle: {
    fontSize: 16,
    color: '#777',
    marginTop: 6,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginTop: 35,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  cardText: {
    color: '#777',
    marginTop: 12,
  },

  button: {
    backgroundColor: '#222',
    padding: 18,
    borderRadius: 12,
    marginTop: 25,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
