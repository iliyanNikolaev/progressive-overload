
import { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';

import {
  addSet,
  getWorkoutSets,
  updateSet,
} from '../database/database';

export default function WorkoutExerciseCard({ item, previousSets }) {
  const [sets, setSets] = useState([]);

  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('0');

  const [editingSetId, setEditingSetId] = useState(null);
  const [editReps, setEditReps] = useState('');
  const [editWeight, setEditWeight] = useState('');

  function loadSets() {
    const data = getWorkoutSets(item.id);
    setSets(data);
  }

  useEffect(() => {
    loadSets();
  }, [item.id]);

  // Добавяне на нова серия
  function handleAddSet() {
    const parsedReps = Number(reps);
    const parsedWeight = Number(weight.replace(',', '.'));

    if (
      !Number.isInteger(parsedReps) ||
      parsedReps <= 0 ||
      !Number.isFinite(parsedWeight) ||
      parsedWeight < 0
    ) {
      return;
    }

    const nextSetNumber = sets.length + 1;

    addSet(
      item.id,
      nextSetNumber,
      parsedReps,
      parsedWeight
    );

    setReps('');
    setWeight('0');

    loadSets();
  }

  // Започване на редакция
  function startEditing(set) {
    setEditingSetId(set.id);
    setEditReps(String(set.reps));
    setEditWeight(String(set.weight));
  }

  // Отказ от редакция
  function cancelEditing() {
    setEditingSetId(null);
    setEditReps('');
    setEditWeight('');
  }

  // Запазване на редакцията
  function saveEditing() {
    const parsedReps = Number(editReps);
    const parsedWeight = Number(
      editWeight.replace(',', '.')
    );

    if (
      !Number.isInteger(parsedReps) ||
      parsedReps <= 0 ||
      !Number.isFinite(parsedWeight) ||
      parsedWeight < 0
    ) {
      return;
    }

    updateSet(
      editingSetId,
      parsedReps,
      parsedWeight
    );

    cancelEditing();
    loadSets();
  }

  return (
    <View style={styles.card}>

      {/* Име на упражнението */}
      <Text style={styles.exerciseName}>
        {item.name}
      </Text>

      {/* Предишни резултати */}
      <View style={styles.previousContainer}>
        <Text style={styles.previousTitle}>
          Предишна тренировка
        </Text>

        {previousSets.length === 0 ? (
          <Text style={styles.previousText}>
            Няма предишни резултати
          </Text>
        ) : (
          previousSets.map((set) => (
            <Text
              key={set.set_number}
              style={styles.previousText}
            >
              {set.set_number}. {set.reps} повторения × {set.weight} кг
            </Text>
          ))
        )}
      </View>

      {/* Текущи серии */}
      <Text style={styles.sectionTitle}>
        Текущи серии
      </Text>

      {sets.map((set) => (
        <View key={set.id} style={styles.savedSet}>

          {editingSetId === set.id ? (

            // Режим редакция
            <View style={styles.editContainer}>

              <Text style={styles.setNumber}>
                Серия {set.set_number}
              </Text>

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.editInput}
                  value={editReps}
                  onChangeText={setEditReps}
                  keyboardType="number-pad"
                  placeholder="Повторения"
                />

                <TextInput
                  style={styles.editInput}
                  value={editWeight}
                  onChangeText={setEditWeight}
                  keyboardType="decimal-pad"
                  placeholder="Кг"
                />
              </View>

              <View style={styles.editActions}>

                <Pressable
                  style={styles.saveButton}
                  onPress={saveEditing}
                >
                  <Text style={styles.actionButtonText}>
                    Запази
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.cancelButton}
                  onPress={cancelEditing}
                >
                  <Text style={styles.actionButtonText}>
                    Отказ
                  </Text>
                </Pressable>

              </View>
            </View>

          ) : (

            // Нормален режим
            <>
              <Text style={styles.setNumber}>
                {set.set_number}
              </Text>

              <Text style={styles.savedSetText}>
                {set.reps} повторения
              </Text>

              <Text style={styles.savedSetText}>
                {set.weight} кг
              </Text>

              <Pressable
                onPress={() => startEditing(set)}
              >
                <Text style={styles.editButton}>
                  Редактирай
                </Text>
              </Pressable>
            </>
          )}

        </View>
      ))}

      {/* Добавяне на нова серия */}
      <View style={styles.inputRow}>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Повторения
          </Text>

          <TextInput
            style={styles.input}
            value={reps}
            onChangeText={setReps}
            keyboardType="number-pad"
            placeholder="10"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Тежест (кг)
          </Text>

          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            placeholder="0"
          />
        </View>

      </View>

      <Pressable
        style={styles.addButton}
        onPress={handleAddSet}
      >
        <Text style={styles.addButtonText}>
          + Добави серия
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },

  exerciseName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 14,
  },

  previousContainer: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },

  previousTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6,
  },

  previousText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 3,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },

  savedSet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 6,
  },

  setNumber: {
    fontWeight: 'bold',
    color: '#374151',
  },

  savedSetText: {
    fontSize: 13,
    color: '#374151',
  },

  editButton: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '600',
  },

  editContainer: {
    flex: 1,
    gap: 10,
  },

  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  inputGroup: {
    flex: 1,
  },

  inputLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 5,
  },

  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    color: '#111827',
  },

  editInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    color: '#111827',
  },

  editActions: {
    flexDirection: 'row',
    gap: 10,
  },

  saveButton: {
    backgroundColor: '#16a34a',
    padding: 10,
    borderRadius: 8,
  },

  cancelButton: {
    backgroundColor: '#6b7280',
    padding: 10,
    borderRadius: 8,
  },

  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },

  addButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 14,
  },

  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },

});
