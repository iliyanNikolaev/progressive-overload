
import { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  addSet,
  getWorkoutSets,
  updateSet,
  deleteSet,
  deleteExerciseFromWorkout,
} from '../database/database';

export default function WorkoutExerciseCard({
  item,
  previousSets,
  onExerciseDeleted,
}) {
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

  function handleAddSet() {
    const parsedReps = Number(reps);
    const parsedWeight = Number(weight.replace(',', '.'));

    if (
      !Number.isInteger(parsedReps) ||
      parsedReps <= 0 ||
      !Number.isFinite(parsedWeight) ||
      parsedWeight < 0
    ) {
      Alert.alert(
        'Невалидни данни',
        'Въведи валиден брой повторения и тежест.'
      );
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

  function startEditing(set) {
    setEditingSetId(set.id);
    setEditReps(String(set.reps));
    setEditWeight(String(set.weight));
  }

  function cancelEditing() {
    setEditingSetId(null);
    setEditReps('');
    setEditWeight('');
  }

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
      Alert.alert(
        'Невалидни данни',
        'Въведи валиден брой повторения и тежест.'
      );
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

  function handleDeleteSet(set) {
    Alert.alert(
      'Изтриване на серия',
      `Сигурен ли си, че искаш да изтриеш серия ${set.set_number}?`,
      [
        {
          text: 'Отказ',
          style: 'cancel',
        },
        {
          text: 'Изтрий',
          style: 'destructive',
          onPress: () => {
            deleteSet(
              set.id,
              item.id,
              set.set_number
            );

            loadSets();
          },
        },
      ]
    );
  }

  function handleDeleteExercise() {
    Alert.alert(
      'Изтриване на упражнение',
      `Сигурен ли си, че искаш да премахнеш "${item.name}" от тази тренировка?`,
      [
        {
          text: 'Отказ',
          style: 'cancel',
        },
        {
          text: 'Изтрий',
          style: 'destructive',
          onPress: () => {
            deleteExerciseFromWorkout(item.id);
            onExerciseDeleted();
          },
        },
      ]
    );
  }

  function handleWeightFocus() {
    if (weight === '0') {
      setWeight('');
    }
  }

  function handleEditWeightFocus() {
    if (editWeight === '0') {
      setEditWeight('');
    }
  }

  return (
    <View style={styles.card}>
      {/* Exercise header */}
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseIcon}>
          <MaterialCommunityIcons
            name="dumbbell"
            size={23}
            color="#C4B5FD"
          />
        </View>

        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>
            {item.name}
          </Text>

          <Text style={styles.exerciseSubtitle}>
            {sets.length} {sets.length === 1 ? 'серия' : 'серии'} записани
          </Text>
        </View>

        <View style={styles.exerciseBadge}>
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={17}
            color="#A78BFA"
          />
        </View>
      </View>

      {/* Previous workout */}
      <LinearGradient
        colors={['#171A32', '#111426']}
        style={styles.previousContainer}
      >
        <View style={styles.previousHeader}>
          <MaterialCommunityIcons
            name="history"
            size={18}
            color="#A78BFA"
          />

          <Text style={styles.previousTitle}>
            ПРЕДИШНА ТРЕНИРОВКА
          </Text>
        </View>

        {previousSets.length === 0 ? (
          <Text style={styles.previousEmpty}>
            Все още няма предишни резултати
          </Text>
        ) : (
          <View style={styles.previousSets}>
            {previousSets.map((set) => (
              <View
                key={set.set_number}
                style={styles.previousSetRow}
              >
                <Text style={styles.previousSetNumber}>
                  {set.set_number}
                </Text>

                <Text style={styles.previousText}>
                  {set.reps} повторения
                </Text>

                <Text style={styles.previousWeight}>
                  {set.weight} кг
                </Text>
              </View>
            ))}
          </View>
        )}
      </LinearGradient>

      {/* Current sets */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionIndicator} />

          <Text style={styles.sectionTitle}>
            Текущи серии
          </Text>
        </View>

        <Text style={styles.setCount}>
          {sets.length} серии
        </Text>
      </View>

      {sets.length > 0 && (
        <View style={styles.setsTable}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.numberColumn]}>
              СЕРИЯ
            </Text>

            <Text style={[styles.tableHeaderText, styles.valueColumn]}>
              ПОВТОРЕНИЯ
            </Text>

            <Text style={[styles.tableHeaderText, styles.valueColumn]}>
              ТЕЖЕСТ
            </Text>

            <View style={styles.actionsColumn} />
          </View>

          {sets.map((set) => (
            <View key={set.id} style={styles.savedSet}>
              {editingSetId === set.id ? (
                <View style={styles.editContainer}>
                  <Text style={styles.editSetTitle}>
                    Редакция на серия {set.set_number}
                  </Text>

                  <View style={styles.editInputRow}>
                    <View style={styles.editInputGroup}>
                      <Text style={styles.inputLabel}>
                        Повторения
                      </Text>

                      <TextInput
                        style={styles.editInput}
                        value={editReps}
                        onChangeText={setEditReps}
                        keyboardType="number-pad"
                        placeholder="10"
                        placeholderTextColor="#64748B"
                      />
                    </View>

                    <View style={styles.editInputGroup}>
                      <Text style={styles.inputLabel}>
                        Тежест (кг)
                      </Text>

                      <TextInput
                        style={styles.editInput}
                        value={editWeight}
                        onChangeText={setEditWeight}
                        onFocus={handleEditWeightFocus}
                        keyboardType="decimal-pad"
                        placeholder="0"
                        placeholderTextColor="#64748B"
                      />
                    </View>
                  </View>

                  <View style={styles.editActions}>
                    <Pressable
                      style={styles.saveButton}
                      onPress={saveEditing}
                    >
                      <MaterialCommunityIcons
                        name="check"
                        size={17}
                        color="#FFFFFF"
                      />

                      <Text style={styles.actionButtonText}>
                        Запази
                      </Text>
                    </Pressable>

                    <Pressable
                      style={styles.cancelButton}
                      onPress={cancelEditing}
                    >
                      <MaterialCommunityIcons
                        name="close"
                        size={17}
                        color="#CBD5E1"
                      />

                      <Text style={styles.cancelButtonText}>
                        Отказ
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.setNumberContainer}>
                    <Text style={styles.setNumber}>
                      {set.set_number}
                    </Text>
                  </View>

                  <Text style={styles.savedSetText}>
                    {set.reps}
                  </Text>

                  <Text style={styles.savedWeightText}>
                    {set.weight} кг
                  </Text>

                  <View style={styles.setActions}>
                    <Pressable
                      style={styles.iconButton}
                      onPress={() => startEditing(set)}
                      hitSlop={8}
                    >
                      <MaterialCommunityIcons
                        name="pencil-outline"
                        size={19}
                        color="#A78BFA"
                      />
                    </Pressable>

                    <Pressable
                      style={styles.iconButton}
                      onPress={() => handleDeleteSet(set)}
                      hitSlop={8}
                    >
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={19}
                        color="#F87171"
                      />
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          ))}
        </View>
      )}

      {sets.length === 0 && (
        <View style={styles.emptySets}>
          <MaterialCommunityIcons
            name="clipboard-list-outline"
            size={25}
            color="#64748B"
          />

          <Text style={styles.emptySetsText}>
            Все още няма добавени серии
          </Text>
        </View>
      )}

      {/* Add set form */}
      <View style={styles.addSetContainer}>
        <View style={styles.addSetHeader}>
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={19}
            color="#A78BFA"
          />

          <Text style={styles.addSetTitle}>
            Добави нова серия
          </Text>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              ПОВТОРЕНИЯ
            </Text>

            <TextInput
              style={styles.input}
              value={reps}
              onChangeText={setReps}
              keyboardType="number-pad"
              placeholder="10"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              ТЕЖЕСТ (КГ)
            </Text>

            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              onFocus={handleWeightFocus}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor="#64748B"
            />
          </View>
        </View>

        <Pressable
          onPress={handleAddSet}
          style={styles.addButtonWrapper}
        >
          <LinearGradient
            colors={['#8B5CF6', '#6366F1', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButton}
          >
            <MaterialCommunityIcons
              name="plus"
              size={21}
              color="#FFFFFF"
            />

            <Text style={styles.addButtonText}>
              Добави серия
            </Text>
          </LinearGradient>
        </Pressable>
      </View>

      {/* Delete exercise */}
      <Pressable
        style={styles.deleteExerciseButton}
        onPress={handleDeleteExercise}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={17}
          color="#F87171"
        />

        <Text style={styles.deleteExerciseButtonText}>
          Изтрий упражнението
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0D1224',
    borderRadius: 22,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#252B45',
    overflow: 'hidden',
  },

  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
  },

  exerciseIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#292044',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#514078',
  },

  exerciseInfo: {
    flex: 1,
  },

  exerciseName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
  },

  exerciseSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },

  exerciseBadge: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: '#25203B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  previousContainer: {
    padding: 13,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#292C4B',
    marginBottom: 20,
  },

  previousHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 11,
  },

  previousTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#A5B4FC',
  },

  previousEmpty: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },

  previousSets: {
    gap: 8,
  },

  previousSetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF08',
    borderRadius: 9,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  previousSetNumber: {
    width: 27,
    color: '#A78BFA',
    fontWeight: '800',
    fontSize: 12,
  },

  previousText: {
    flex: 1,
    color: '#CBD5E1',
    fontSize: 12,
  },

  previousWeight: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  sectionIndicator: {
    width: 4,
    height: 17,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F1F5F9',
  },

  setCount: {
    fontSize: 11,
    color: '#A78BFA',
    backgroundColor: '#292044',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
    fontWeight: '700',
  },

  setsTable: {
    marginBottom: 8,
  },

  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#252B45',
  },

  tableHeaderText: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  numberColumn: {
    width: 45,
  },

  valueColumn: {
    flex: 1,
    textAlign: 'center',
  },

  actionsColumn: {
    width: 65,
  },

  savedSet: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E263D',
  },

  setNumberContainer: {
    width: 45,
    alignItems: 'flex-start',
  },

  setNumber: {
    color: '#C4B5FD',
    fontSize: 13,
    fontWeight: '800',
  },

  savedSetText: {
    flex: 1,
    textAlign: 'center',
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },

  savedWeightText: {
    flex: 1,
    textAlign: 'center',
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
  },

  setActions: {
    width: 65,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 7,
  },

  iconButton: {
    width: 29,
    height: 29,
    borderRadius: 9,
    backgroundColor: '#20243B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptySets: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    backgroundColor: '#11182B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#252B45',
    borderStyle: 'dashed',
    marginBottom: 8,
  },

  emptySetsText: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 8,
  },

  addSetContainer: {
    backgroundColor: '#11182B',
    padding: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#252B45',
    marginTop: 13,
  },

  addSetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 13,
  },

  addSetTitle: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
  },

  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },

  inputGroup: {
    flex: 1,
  },

  inputLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 7,
  },

  input: {
    backgroundColor: '#080D1B',
    borderWidth: 1,
    borderColor: '#303956',
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  addButtonWrapper: {
    marginTop: 13,
    borderRadius: 12,
    overflow: 'hidden',
  },

  addButton: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 11,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  editContainer: {
    flex: 1,
    paddingVertical: 9,
    gap: 11,
  },

  editSetTitle: {
    color: '#C4B5FD',
    fontSize: 13,
    fontWeight: '800',
  },

  editInputRow: {
    flexDirection: 'row',
    gap: 10,
  },

  editInputGroup: {
    flex: 1,
  },

  editInput: {
    backgroundColor: '#080D1B',
    borderWidth: 1,
    borderColor: '#514078',
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
  },

  editActions: {
    flexDirection: 'row',
    gap: 9,
  },

  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#166534',
    padding: 11,
    borderRadius: 10,
  },

  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#252B45',
    padding: 11,
    borderRadius: 10,
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  cancelButtonText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
  },

  deleteExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 13,
    marginTop: 10,
  },

  deleteExerciseButtonText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '700',
  },
});
