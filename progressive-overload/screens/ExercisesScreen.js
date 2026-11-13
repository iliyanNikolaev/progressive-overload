
import { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';

import {
  getExercises,
  addExercise,
  updateExercise,
} from '../database/database';

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState([]);
  const [exerciseName, setExerciseName] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Зареждаме упражненията от базата
  function loadExercises() {
    const data = getExercises();
    setExercises(data);
  }

  useEffect(() => {
    loadExercises();
  }, []);

  // Добавяме упражнение
  function handleAddExercise() {
    const name = exerciseName.trim();

    if (name === '') {
      return;
    }

    addExercise(name);

    setExerciseName('');
    loadExercises();
  }

  // Започваме редактиране
  function startEditing(exercise) {
    setEditingId(exercise.id);
    setExerciseName(exercise.name);
  }

  // Запазваме редакцията
  function handleSaveEdit() {
    const name = exerciseName.trim();

    if (name === '') {
      return;
    }

    updateExercise(editingId, name);

    setEditingId(null);
    setExerciseName('');
    loadExercises();
  }

  // Отказваме редакцията
  function cancelEditing() {
    setEditingId(null);
    setExerciseName('');
  }

  // Визуализираме едно упражнение
  function renderExercise({ item }) {
    return (
      <View style={styles.exerciseItem}>
        <Text style={styles.exerciseName}>
          {item.name}
        </Text>

        <Pressable onPress={() => startEditing(item)}>
          <Text style={styles.editButton}>
            Редактирай
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Моите упражнения</Text>

      <Text style={styles.subtitle}>
        Управлявай своя каталог с упражнения.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Име на упражнението"
        value={exerciseName}
        onChangeText={setExerciseName}
      />

      {editingId === null ? (
        <Pressable
          style={styles.button}
          onPress={handleAddExercise}
        >
          <Text style={styles.buttonText}>
            + Добави упражнение
          </Text>
        </Pressable>
      ) : (
        <View>
          <Pressable
            style={styles.button}
            onPress={handleSaveEdit}
          >
            <Text style={styles.buttonText}>
              Запази промените
            </Text>
          </Pressable>

          <Pressable
            style={styles.cancelButton}
            onPress={cancelEditing}
          >
            <Text style={styles.cancelButtonText}>
              Отказ
            </Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Всички упражнения ({exercises.length})
      </Text>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExercise}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Все още няма добавени упражнения.
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
    paddingTop: 65,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cancelButton: {
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  exerciseItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
  },
  editButton: {
    color: '#2563eb',
    fontWeight: '600',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
});
