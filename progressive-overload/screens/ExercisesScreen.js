
import { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Keyboard,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  getExercises,
  addExercise,
  updateExercise,
} from '../database/database';

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState([]);
  const [exerciseName, setExerciseName] = useState('');
  const [editingId, setEditingId] = useState(null);

  function loadExercises() {
    const data = getExercises();
    setExercises(data);
  }

  useEffect(() => {
    loadExercises();
  }, []);

  function handleAddExercise() {
    const name = exerciseName.trim();

    if (name === '') {
      return;
    }

    addExercise(name);

    setExerciseName('');
    loadExercises();

    Keyboard.dismiss();
  }

  function startEditing(exercise) {
    setEditingId(exercise.id);
    setExerciseName(exercise.name);
  }

  function handleSaveEdit() {
    const name = exerciseName.trim();

    if (name === '') {
      return;
    }

    updateExercise(editingId, name);

    setEditingId(null);
    setExerciseName('');
    loadExercises();

    Keyboard.dismiss();
  }

  function cancelEditing() {
    setEditingId(null);
    setExerciseName('');
    Keyboard.dismiss();
  }

  function renderExercise({ item, index }) {
    return (
      <View style={styles.exerciseItem}>
        <View style={styles.exerciseLeft}>
          <LinearGradient
            colors={['#312E81', '#6D28D9']}
            style={styles.exerciseIcon}
          >
            <MaterialCommunityIcons
              name="dumbbell"
              size={22}
              color="#FFFFFF"
            />
          </LinearGradient>

          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseNumber}>
              УПРАЖНЕНИЕ {String(index + 1).padStart(2, '0')}
            </Text>

            <Text style={styles.exerciseName}>
              {item.name}
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.editButton}
          onPress={() => startEditing(item)}
        >
          <MaterialCommunityIcons
            name="pencil-outline"
            size={20}
            color="#A78BFA"
          />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#111827', '#080B16', '#03040A']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.glow} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>YOUR LIBRARY</Text>

            <Text style={styles.title}>
              Моите упражнения
            </Text>

            <Text style={styles.subtitle}>
              Изгради своята тренировъчна библиотека.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <MaterialCommunityIcons
              name="dumbbell"
              size={25}
              color="#A78BFA"
            />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {editingId === null
              ? 'Добави упражнение'
              : 'Редактирай упражнение'}
          </Text>

          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons
              name="weight-lifter"
              size={21}
              color="#8B5CF6"
            />

            <TextInput
              style={styles.input}
              placeholder="Име на упражнението"
              placeholderTextColor="#6B7280"
              value={exerciseName}
              onChangeText={setExerciseName}
              selectionColor="#A78BFA"
              returnKeyType="done"
              onSubmitEditing={
                editingId === null
                  ? handleAddExercise
                  : handleSaveEdit
              }
            />
          </View>

          <Pressable
            onPress={
              editingId === null
                ? handleAddExercise
                : handleSaveEdit
            }
            style={({ pressed }) => [
              styles.buttonWrapper,
              pressed && styles.buttonPressed,
            ]}
          >
            <LinearGradient
              colors={['#8B5CF6', '#6366F1', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <MaterialCommunityIcons
                name={editingId === null ? 'plus' : 'check'}
                size={22}
                color="#FFFFFF"
              />

              <Text style={styles.buttonText}>
                {editingId === null
                  ? 'Добави упражнение'
                  : 'Запази промените'}
              </Text>
            </LinearGradient>
          </Pressable>

          {editingId !== null && (
            <Pressable
              style={styles.cancelButton}
              onPress={cancelEditing}
            >
              <Text style={styles.cancelButtonText}>
                Отказ от редакцията
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.listHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Твоят каталог
            </Text>

            <Text style={styles.sectionSubtitle}>
              Всички налични упражнения
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {exercises.length}
            </Text>
          </View>
        </View>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderExercise}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={42}
                color="#6B7280"
              />

              <Text style={styles.emptyTitle}>
                Каталогът е празен
              </Text>

              <Text style={styles.emptyText}>
                Добави първото си упражнение, за да започнеш.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080B16',
  },

  glow: {
    position: 'absolute',
    top: 100,
    right: -130,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#4C1D95',
    opacity: 0.15,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 65,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  eyebrow: {
    color: '#A78BFA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.5,
    marginBottom: 9,
  },

  title: {
    color: '#F9FAFB',
    fontSize: 27,
    fontWeight: '800',
  },

  subtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 7,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  formCard: {
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 20,
    padding: 17,
    marginBottom: 27,
  },

  formTitle: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },

  inputWrapper: {
    height: 54,
    borderRadius: 13,
    backgroundColor: 'rgba(3,7,18,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 11,
    marginBottom: 13,
  },

  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },

  buttonWrapper: {
    borderRadius: 13,
    overflow: 'hidden',
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  button: {
    height: 53,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  cancelButton: {
    alignItems: 'center',
    paddingTop: 14,
  },

  cancelButtonText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    color: '#F9FAFB',
    fontSize: 19,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },

  countBadge: {
    minWidth: 36,
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(139,92,246,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    color: '#C4B5FD',
    fontSize: 15,
    fontWeight: '800',
  },

  listContent: {
    paddingBottom: 110,
  },

  exerciseItem: {
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 13,
    marginBottom: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  exerciseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  exerciseIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  exerciseInfo: {
    marginLeft: 13,
    flex: 1,
  },

  exerciseNumber: {
    color: '#8B5CF6',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },

  exerciseName: {
    color: '#F9FAFB',
    fontSize: 15,
    fontWeight: '700',
  },

  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(139,92,246,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 45,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },

  emptyTitle: {
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 15,
  },

  emptyText: {
    color: '#6B7280',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
