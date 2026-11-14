
import { useEffect, useState } from 'react';

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  getExercises,
  getWorkoutExercises,
  addExerciseToWorkout,
  getLastExercisePerformance,
  getWorkoutSetCount,
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

  function handleExerciseDeleted() {
    loadData();
  }

  function handleFinishWorkout() {
    if (workoutExercises.length === 0) {
      Alert.alert(
        'Няма упражнения',
        'Добави поне едно упражнение преди да приключиш тренировката.'
      );
      return;
    }

    const totalSets = getWorkoutSetCount(workoutId);

    if (totalSets === 0) {
      Alert.alert(
        'Няма записани серии',
        'Запиши поне една серия преди да приключиш тренировката.'
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

  function renderWorkoutExercise(item) {
    const previousSets = getLastExercisePerformance(
      item.exercise_id,
      workoutId
    );

    return (
      <WorkoutExerciseCard
        key={item.id}
        item={item}
        previousSets={previousSets}
        onExerciseDeleted={handleExerciseDeleted}
      />
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#080B16', '#0B1020', '#080B16']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.topGlow} />

      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={30}
        extraHeight={100}
        keyboardShouldPersistTaps="handled"
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            TRAINING SESSION
          </Text>

          <Text style={styles.title}>
            Текуща тренировка
          </Text>

          <Text style={styles.subtitle}>
            Записвай сериите и следи прогреса си
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setShowExerciseList(!showExerciseList)}
        >
          <LinearGradient
            colors={['#8B5CF6', '#6366F1', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButtonGradient}
          >
            <MaterialCommunityIcons
              name={
                showExerciseList
                  ? 'close-circle-outline'
                  : 'plus-circle-outline'
              }
              size={23}
              color="#FFFFFF"
            />

            <Text style={styles.addButtonText}>
              {showExerciseList
                ? 'Затвори списъка'
                : 'Добави упражнение'}
            </Text>

            <MaterialCommunityIcons
              name={showExerciseList ? 'chevron-up' : 'chevron-down'}
              size={21}
              color="#FFFFFF"
            />
          </LinearGradient>
        </Pressable>

        {showExerciseList && (
          <View style={styles.exerciseList}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={20}
                  color="#A78BFA"
                />
              </View>

              <View>
                <Text style={styles.sectionTitle}>
                  Избери упражнение
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Добави го към текущата тренировка
                </Text>
              </View>
            </View>

            {exercises.length === 0 ? (
              <View style={styles.listEmpty}>
                <MaterialCommunityIcons
                  name="clipboard-text-outline"
                  size={30}
                  color="#737D96"
                />

                <Text style={styles.emptyText}>
                  Все още нямаш упражнения в каталога.
                </Text>
              </View>
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
                    <View style={styles.exerciseOptionLeft}>
                      <View style={styles.exerciseOptionIcon}>
                        <MaterialCommunityIcons
                          name="dumbbell"
                          size={17}
                          color={alreadyAdded ? '#64748B' : '#A78BFA'}
                        />
                      </View>

                      <Text style={styles.exerciseOptionText}>
                        {exercise.name}
                      </Text>
                    </View>

                    {alreadyAdded ? (
                      <View style={styles.addedBadge}>
                        <MaterialCommunityIcons
                          name="check"
                          size={14}
                          color="#4ADE80"
                        />

                        <Text style={styles.addedText}>
                          Добавено
                        </Text>
                      </View>
                    ) : (
                      <MaterialCommunityIcons
                        name="plus-circle-outline"
                        size={21}
                        color="#A78BFA"
                      />
                    )}
                  </Pressable>
                );
              })
            )}
          </View>
        )}

        <View style={styles.workoutSectionHeader}>
          <View>
            <Text style={styles.workoutSectionTitle}>
              Упражнения
            </Text>

            <Text style={styles.workoutSectionSubtitle}>
              {workoutExercises.length} добавени
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {workoutExercises.length}
            </Text>
          </View>
        </View>

        {workoutExercises.length === 0 ? (
          <View style={styles.emptyWorkout}>
            <View style={styles.emptyWorkoutIcon}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={35}
                color="#8B5CF6"
              />
            </View>

            <Text style={styles.emptyWorkoutTitle}>
              Тренировката е празна
            </Text>

            <Text style={styles.emptyWorkoutDescription}>
              Добави упражнения, за да започнеш да записваш сериите си.
            </Text>
          </View>
        ) : (
          workoutExercises.map(renderWorkoutExercise)
        )}

        <Pressable
          style={({ pressed }) => [
            styles.finishButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleFinishWorkout}
        >
          <LinearGradient
            colors={['#16A34A', '#15803D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.finishButtonGradient}
          >
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={22}
              color="#FFFFFF"
            />

            <Text style={styles.finishButtonText}>
              Приключи тренировка
            </Text>
          </LinearGradient>
        </Pressable>

        <Text style={styles.finishHint}>
          Запиши поне една серия, за да приключиш тренировката.
        </Text>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080B16',
  },

  topGlow: {
    position: 'absolute',
    top: -130,
    right: -110,
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: '#312E81',
    opacity: 0.17,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 17,
    paddingTop: 18,
    paddingBottom: 125,
  },

  header: {
    marginBottom: 23,
  },

  eyebrow: {
    color: '#8B5CF6',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 27,
    fontWeight: '800',
  },

  subtitle: {
    color: '#858DA5',
    fontSize: 12,
    marginTop: 7,
  },

  addButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 17,
  },

  addButtonGradient: {
    minHeight: 54,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },

  exerciseList: {
    backgroundColor: 'rgba(20, 26, 46, 0.95)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    padding: 15,
    marginBottom: 22,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  sectionTitle: {
    color: '#F1F5F9',
    fontSize: 15,
    fontWeight: '700',
  },

  sectionSubtitle: {
    color: '#858DA5',
    fontSize: 11,
    marginTop: 3,
  },

  exerciseOption: {
    minHeight: 53,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.10)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
  },

  exerciseOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  exerciseOptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(139, 92, 246, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  exerciseOptionText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },

  disabledExercise: {
    opacity: 0.55,
  },

  addedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.10)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },

  addedText: {
    color: '#4ADE80',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 3,
  },

  listEmpty: {
    alignItems: 'center',
    paddingVertical: 22,
  },

  emptyText: {
    color: '#858DA5',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },

  workoutSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 5,
  },

  workoutSectionTitle: {
    color: '#F1F5F9',
    fontSize: 19,
    fontWeight: '800',
  },

  workoutSectionSubtitle: {
    color: '#858DA5',
    fontSize: 11,
    marginTop: 4,
  },

  countBadge: {
    minWidth: 34,
    height: 34,
    paddingHorizontal: 9,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  countBadgeText: {
    color: '#C4B5FD',
    fontSize: 14,
    fontWeight: '800',
  },

  emptyWorkout: {
    alignItems: 'center',
    backgroundColor: 'rgba(20, 26, 46, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    borderRadius: 18,
    padding: 25,
    marginBottom: 18,
  },

  emptyWorkoutIcon: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: 'rgba(139, 92, 246, 0.13)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  emptyWorkoutTitle: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '700',
  },

  emptyWorkoutDescription: {
    color: '#858DA5',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
  },

  finishButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 18,
  },

  finishButtonGradient: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 15,
  },

  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  finishHint: {
    color: '#667085',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 10,
  },
});
