
import { useCallback, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useFocusEffect } from '@react-navigation/native';

import {
  createWorkout,
  getActiveWorkout,
} from '../database/database';

export default function HomeScreen({ navigation }) {
  const [activeWorkout, setActiveWorkout] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const workout = getActiveWorkout();
      setActiveWorkout(workout);
    }, [])
  );

  function startWorkout() {
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
      <LinearGradient
        colors={['#111827', '#080B16', '#03040A']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>WORKOUT JOURNAL</Text>

            <Text style={styles.title}>
              Твоят прогрес.
              {'\n'}
              Твоите правила.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={25}
              color="#A78BFA"
            />
          </View>
        </View>

        <View style={styles.centerContent}>
          <View style={styles.orbitOuter}>
            <View style={styles.orbitInner}>
              <LinearGradient
                colors={['#312E81', '#6D28D9', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mainIcon}
              >
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={58}
                  color="#FFFFFF"
                />
              </LinearGradient>
            </View>
          </View>

          <Text style={styles.centerTitle}>
            {activeWorkout
              ? 'Продължи започнатото'
              : 'Време е за тренировка'}
          </Text>

          <Text style={styles.subtitle}>
            {activeWorkout
              ? 'Твоята тренировка те очаква.'
              : 'Всяка серия е крачка напред.'}
          </Text>

          <Pressable
            onPress={startWorkout}
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
                name={activeWorkout ? 'play-circle' : 'plus-circle'}
                size={25}
                color="#FFFFFF"
              />

              <Text style={styles.buttonText}>
                {activeWorkout
                  ? 'Продължи тренировка'
                  : 'Започни тренировка'}
              </Text>

              <MaterialCommunityIcons
                name="arrow-right"
                size={22}
                color="#FFFFFF"
              />
            </LinearGradient>
          </Pressable>

          <View style={styles.statusCard}>
            <BlurView
              intensity={35}
              tint="dark"
              style={styles.statusBlur}
            >
              <View style={styles.statusDot} />

              <Text style={styles.statusText}>
                {activeWorkout
                  ? 'ИМАШ АКТИВНА ТРЕНИРОВКА'
                  : 'ГОТОВ ЗА СЛЕДВАЩОТО НИВО?'}
              </Text>
            </BlurView>
          </View>
        </View>

        <View style={styles.footer}>
          <MaterialCommunityIcons
            name="trending-up"
            size={18}
            color="#8B5CF6"
          />

          <Text style={styles.footerText}>
            SMALL STEPS. BIG RESULTS.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080B16',
  },

  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 75,
    paddingBottom: 35,
    justifyContent: 'space-between',
  },

  glowTop: {
    position: 'absolute',
    top: 100,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#4C1D95',
    opacity: 0.18,
  },

  glowBottom: {
    position: 'absolute',
    bottom: 100,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#1D4ED8',
    opacity: 0.15,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  eyebrow: {
    color: '#A78BFA',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 13,
  },

  title: {
    color: '#F9FAFB',
    fontSize: 31,
    fontWeight: '800',
    lineHeight: 39,
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

  centerContent: {
    alignItems: 'center',
    marginTop: -15,
  },

  orbitOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
  },

  orbitInner: {
    width: 175,
    height: 175,
    borderRadius: 88,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainIcon: {
    width: 125,
    height: 125,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },

  centerTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
  },

  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 30,
  },

  buttonWrapper: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  button: {
    minHeight: 64,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  statusCard: {
    marginTop: 20,
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  statusBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 9,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#A78BFA',
  },

  statusText: {
    color: '#C4B5FD',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  footerText: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
