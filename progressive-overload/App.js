import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progressive Overload</Text>

      <Text style={styles.subtitle}>
        Track your progress
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Последна тренировка
        </Text>

        <Text style={styles.cardText}>
          Все още нямаш записани тренировки.
        </Text>
      </View>

      <View style={styles.button}>
        <Text style={styles.buttonText}>
          + Нова тренировка
        </Text>
      </View>

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
