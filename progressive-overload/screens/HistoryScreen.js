
import { useCallback, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  getWorkoutHistory,
  getWorkoutExercises,
  getWorkoutSets,
  deleteWorkout,
} from '../database/database';

export default function HistoryScreen({ navigation }) {
  const [workouts, setWorkouts] = useState([]);

  function loadHistory() {
    const history = getWorkoutHistory() || [];

    const detailedHistory = history.map((workout) => {
      const exercises = getWorkoutExercises(workout.id) || [];

      const totalSets = exercises.reduce((total, exercise) => {
        const sets = getWorkoutSets(exercise.id) || [];
        return total + sets.length;
      }, 0);

      return {
        ...workout,
        exercises,
        totalSets,
      };
    });

    setWorkouts(detailedHistory);
  }

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  function formatDate(dateString) {
    const date = new Date(dateString.replace(' ', 'T') + 'Z');

    return date.toLocaleDateString('bg-BG', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  function handleDeleteWorkout(workout) {
    Alert.alert(
      'Изтриване на тренировка',
      `Сигурен ли си, че искаш да изтриеш Тренировка #${workouts.length - workouts.findIndex((item) => item.id === workout.id)}?\n\nВсички упражнения и серии от тази тренировка ще бъдат изтрити. Това действие не може да бъде отменено.`,
      [
        {
          text: 'Отказ',
          style: 'cancel',
        },
        {
          text: 'Изтрий',
          style: 'destructive',
          onPress: () => {
            try {
              deleteWorkout(workout.id);
              loadHistory();
            } catch (error) {
              console.error('Грешка при изтриване на тренировка:', error);

              Alert.alert(
                'Грешка',
                'Тренировката не можа да бъде изтрита. Опитай отново.'
              );
            }
          },
        },
      ]
    );
  }

  function renderWorkout({ item, index }) {
    return (
      <View style={styles.workoutCard}>
        <LinearGradient
          colors={['#171B32', '#101426', '#0D1120']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <Pressable
              style={styles.cardTitleContainer}
              onPress={() =>
                navigation.navigate('WorkoutDetails', {
                  workoutId: item.id,
                })
              }
            >
              <View style={styles.workoutIcon}>
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={21}
                  color="#A78BFA"
                />
              </View>

              <View style={styles.titleTextContainer}>
                <Text style={styles.workoutTitle}>
                  Тренировка #{workouts.length - index}
                </Text>

                <Text style={styles.workoutDate}>
                  {formatDate(item.date)}
                </Text>
              </View>
            </Pressable>

            <View style={styles.headerActions}>
              <View style={styles.completedBadge}>
                <View style={styles.completedDot} />
                <Text style={styles.completedLabel}>
                  Готова
                </Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && styles.deleteButtonPressed,
                ]}
                onPress={() => handleDeleteWorkout(item)}
                hitSlop={8}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={20}
                  color="#F87171"
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={() =>
              navigation.navigate('WorkoutDetails', {
                workoutId: item.id,
              })
            }
          >
            <View style={styles.cardDivider} />

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="weight-lifter"
                  size={19}
                  color="#A78BFA"
                />

                <Text style={styles.statValue}>
                  {(item.exercises || []).length}
                </Text>

                <Text style={styles.statLabel}>
                  упражнения
                </Text>
              </View>

              <View style={styles.statSeparator} />

              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="repeat"
                  size={19}
                  color="#60A5FA"
                />

                <Text style={styles.statValue}>
                  {item.totalSets}
                </Text>

                <Text style={styles.statLabel}>
                  серии
                </Text>
              </View>
            </View>

            {item.exercises && item.exercises.length > 0 && (
              <View style={styles.exercisePreview}>
                <Text style={styles.exerciseNames} numberOfLines={2}>
                  {item.exercises.map((exercise) => exercise.name).join('  ·  ')}
                </Text>
              </View>
            )}

            <View style={styles.cardFooter}>
              <Text style={styles.detailsText}>
                Виж подробности
              </Text>

              <MaterialCommunityIcons
                name="arrow-right"
                size={18}
                color="#A78BFA"
              />
            </View>
          </Pressable>
        </LinearGradient>
      </View>
    );
  }

  function renderEmptyState() {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <MaterialCommunityIcons
            name="clipboard-text-clock-outline"
            size={42}
            color="#8B5CF6"
          />
        </View>

        <Text style={styles.emptyTitle}>
          Все още няма история
        </Text>

        <Text style={styles.emptyDescription}>
          Когато приключиш първата си тренировка,
          тя ще се появи тук.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#080B16', '#0B1020', '#080B16']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.topGlow} />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          ТВОЯТ ПРОГРЕС
        </Text>

        <Text style={styles.title}>
          История
        </Text>

        <Text style={styles.subtitle}>
          Преглед на приключените тренировки
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryIcon}>
          <MaterialCommunityIcons
            name="calendar-check"
            size={22}
            color="#A78BFA"
          />
        </View>

        <View style={styles.summaryTextContainer}>
          <Text style={styles.summaryValue}>
            {workouts.length}
          </Text>

          <Text style={styles.summaryLabel}>
            {workouts.length === 1
              ? 'приключена тренировка'
              : 'приключени тренировки'}
          </Text>
        </View>
      </View>

      <FlatList
        data={workouts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderWorkout}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080B16',
    paddingHorizontal: 18,
  },

  topGlow: {
    position: 'absolute',
    top: -120,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#312E81',
    opacity: 0.18,
  },

  header: {
    marginTop: 12,
    marginBottom: 22,
  },

  eyebrow: {
    color: '#8B5CF6',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },

  subtitle: {
    color: '#858DA5',
    fontSize: 13,
    marginTop: 6,
  },

  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.09)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
  },

  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: 'rgba(139, 92, 246, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  summaryTextContainer: {
    flex: 1,
  },

  summaryValue: {
    color: '#F8FAFC',
    fontSize: 21,
    fontWeight: '800',
  },

  summaryLabel: {
    color: '#929BB3',
    fontSize: 12,
    marginTop: 2,
  },

  listContent: {
    paddingBottom: 115,
    flexGrow: 1,
  },

  workoutCard: {
    borderRadius: 20,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.17)',
  },

  cardGradient: {
    padding: 17,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },

  workoutIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: 'rgba(139, 92, 246, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  titleTextContainer: {
    flex: 1,
  },

  workoutTitle: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '700',
  },

  workoutDate: {
    color: '#858DA5',
    fontSize: 12,
    marginTop: 5,
    textTransform: 'capitalize',
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.10)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
  },

  completedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
    marginRight: 5,
  },

  completedLabel: {
    color: '#4ADE80',
    fontSize: 10,
    fontWeight: '700',
  },

  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: 'rgba(248, 113, 113, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteButtonPressed: {
    backgroundColor: 'rgba(248, 113, 113, 0.22)',
    transform: [{ scale: 0.92 }],
  },

  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    marginVertical: 16,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  statValue: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },

  statLabel: {
    color: '#858DA5',
    fontSize: 11,
    marginLeft: 5,
  },

  statSeparator: {
    width: 1,
    height: 23,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    marginHorizontal: 12,
  },

  exercisePreview: {
    backgroundColor: 'rgba(255, 255, 255, 0.035)',
    borderRadius: 10,
    padding: 10,
    marginTop: 16,
  },

  exerciseNames: {
    color: '#A5AEC3',
    fontSize: 12,
    lineHeight: 19,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  detailsText: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: '700',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingTop: 65,
  },

  emptyIconContainer: {
    width: 85,
    height: 85,
    borderRadius: 26,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  emptyTitle: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 9,
  },

  emptyDescription: {
    color: '#858DA5',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 21,
  },
});
