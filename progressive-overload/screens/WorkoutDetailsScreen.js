
import { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  getWorkoutExercises,
  getWorkoutSets,
} from '../database/database';

export default function WorkoutDetailsScreen({ route }) {
  const { workoutId } = route.params;

  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const workoutExercises = getWorkoutExercises(workoutId) || [];

    const exercisesWithSets = workoutExercises.map((exercise) => ({
      ...exercise,
      sets: getWorkoutSets(exercise.id) || [],
    }));

    setExercises(exercisesWithSets);
  }, [workoutId]);

  const totalSets = exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );

  const totalReps = exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.reduce(
        (setTotal, set) => setTotal + Number(set.reps || 0),
        0
      ),
    0
  );

  function renderExercise({ item, index }) {
    return (
      <View style={styles.exerciseCard}>
        <LinearGradient
          colors={['#171B32', '#101426', '#0D1120']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseIcon}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={21}
                color="#A78BFA"
              />
            </View>

            <View style={styles.exerciseTitleContainer}>
              <Text style={styles.exerciseNumber}>
                УПРАЖНЕНИЕ {index + 1}
              </Text>

              <Text style={styles.exerciseName}>
                {item.name}
              </Text>
            </View>

            <View style={styles.setCountBadge}>
              <Text style={styles.setCountText}>
                {item.sets.length}
              </Text>

              <Text style={styles.setCountLabel}>
                серии
              </Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {item.sets.length === 0 ? (
            <View style={styles.noSetsContainer}>
              <MaterialCommunityIcons
                name="information-outline"
                size={19}
                color="#858DA5"
              />

              <Text style={styles.emptyText}>
                Няма записани серии.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.tableHeader}>
                <Text style={[styles.columnHeader, styles.setColumn]}>
                  СЕРИЯ
                </Text>

                <Text style={[styles.columnHeader, styles.repsColumn]}>
                  ПОВТОРЕНИЯ
                </Text>

                <Text style={[styles.columnHeader, styles.weightColumn]}>
                  ТЕЖЕСТ
                </Text>
              </View>

              {item.sets.map((set) => (
                <View key={set.id} style={styles.setRow}>
                  <View style={styles.setNumberContainer}>
                    <Text style={styles.setNumber}>
                      {set.set_number}
                    </Text>
                  </View>

                  <Text style={[styles.setValue, styles.repsColumn]}>
                    {set.reps}
                  </Text>

                  <View style={[styles.weightContainer, styles.weightColumn]}>
                    <Text style={styles.weightValue}>
                      {set.weight}
                    </Text>

                    <Text style={styles.weightUnit}>
                      кг
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </LinearGradient>
      </View>
    );
  }

  function renderEmptyState() {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <MaterialCommunityIcons
            name="clipboard-text-outline"
            size={42}
            color="#8B5CF6"
          />
        </View>

        <Text style={styles.emptyTitle}>
          Няма записани упражнения
        </Text>

        <Text style={styles.emptyDescription}>
          За тази тренировка няма налични данни.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#080B16', '#0B1020', '#080B16']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.topGlow} />

      <FlatList
        data={exercises}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderExercise}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>
                TRAINING REPORT
              </Text>

              <Text style={styles.title}>
                Детайли на тренировката
              </Text>

              <Text style={styles.subtitle}>
                Преглед на записаните упражнения и серии
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <View style={styles.summaryIcon}>
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={21}
                    color="#A78BFA"
                  />
                </View>

                <Text style={styles.summaryValue}>
                  {exercises.length}
                </Text>

                <Text style={styles.summaryLabel}>
                  упражнения
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <View style={styles.summaryIcon}>
                  <MaterialCommunityIcons
                    name="repeat"
                    size={21}
                    color="#60A5FA"
                  />
                </View>

                <Text style={styles.summaryValue}>
                  {totalSets}
                </Text>

                <Text style={styles.summaryLabel}>
                  серии
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <View style={styles.summaryIcon}>
                  <MaterialCommunityIcons
                    name="counter"
                    size={21}
                    color="#34D399"
                  />
                </View>

                <Text style={styles.summaryValue}>
                  {totalReps}
                </Text>

                <Text style={styles.summaryLabel}>
                  повторения
                </Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Упражнения
              </Text>

              <Text style={styles.sectionCount}>
                {exercises.length} общо
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={renderEmptyState}
      />
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
    top: -120,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#312E81',
    opacity: 0.18,
  },

  listContent: {
    paddingHorizontal: 17,
    paddingTop: 18,
    paddingBottom: 35,
    flexGrow: 1,
  },

  header: {
    marginBottom: 21,
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
    fontSize: 25,
    fontWeight: '800',
  },

  subtitle: {
    color: '#858DA5',
    fontSize: 12,
    marginTop: 7,
  },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(20, 26, 46, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.18)',
    borderRadius: 18,
    paddingVertical: 16,
    marginBottom: 25,
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },

  summaryIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  summaryValue: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },

  summaryLabel: {
    color: '#858DA5',
    fontSize: 10,
    marginTop: 4,
  },

  summaryDivider: {
    width: 1,
    height: 65,
    backgroundColor: 'rgba(148, 163, 184, 0.13)',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },

  sectionTitle: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '800',
  },

  sectionCount: {
    color: '#858DA5',
    fontSize: 11,
  },

  exerciseCard: {
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.17)',
    marginBottom: 14,
  },

  cardGradient: {
    padding: 16,
  },

  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  exerciseIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: 'rgba(139, 92, 246, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  exerciseTitleContainer: {
    flex: 1,
  },

  exerciseNumber: {
    color: '#8B5CF6',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },

  exerciseName: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '700',
  },

  setCountBadge: {
    minWidth: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  setCountText: {
    color: '#C4B5FD',
    fontSize: 15,
    fontWeight: '800',
  },

  setCountLabel: {
    color: '#858DA5',
    fontSize: 8,
    marginTop: 1,
  },

  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    marginVertical: 16,
  },

  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },

  columnHeader: {
    color: '#737D96',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
  },

  setColumn: {
    flex: 1,
  },

  repsColumn: {
    flex: 1.3,
    textAlign: 'center',
  },

  weightColumn: {
    flex: 1,
    textAlign: 'right',
  },

  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 43,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.09)',
  },

  setNumberContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },

  setNumber: {
    color: '#C4B5FD',
    fontSize: 12,
    fontWeight: '800',
    backgroundColor: 'rgba(139, 92, 246, 0.13)',
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  setValue: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },

  weightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  weightValue: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: '800',
  },

  weightUnit: {
    color: '#858DA5',
    fontSize: 10,
    marginLeft: 4,
  },

  noSetsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },

  emptyText: {
    color: '#858DA5',
    fontSize: 12,
    marginLeft: 8,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 45,
  },

  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  emptyTitle: {
    color: '#F1F5F9',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },

  emptyDescription: {
    color: '#858DA5',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
  },
});
