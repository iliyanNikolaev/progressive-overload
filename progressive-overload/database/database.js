
import * as SQLite from 'expo-sqlite';

// Отваряме или създаваме базата данни
export const db = SQLite.openDatabaseSync('workouts.db');

// Инициализираме базата данни
export function initializeDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS workout_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,

      FOREIGN KEY (workout_id)
        REFERENCES workouts(id)
        ON DELETE CASCADE,

      FOREIGN KEY (exercise_id)
        REFERENCES exercises(id)
    );

    CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_exercise_id INTEGER NOT NULL,
      set_number INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight REAL NOT NULL DEFAULT 0,

      FOREIGN KEY (workout_exercise_id)
        REFERENCES workout_exercises(id)
        ON DELETE CASCADE
    );
  `);

  // Проверяваме дали колоната completed съществува
  const workoutColumns = db.getAllSync(
    'PRAGMA table_info(workouts)'
  );

  const hasCompletedColumn = workoutColumns.some(
    (column) => column.name === 'completed'
  );

  if (!hasCompletedColumn) {
    db.execSync(`
      ALTER TABLE workouts
      ADD COLUMN completed INTEGER NOT NULL DEFAULT 0
    `);
  }

  // Проверяваме дали колоната is_active съществува
  const exerciseColumns = db.getAllSync(
    'PRAGMA table_info(exercises)'
  );

  const hasActiveColumn = exerciseColumns.some(
    (column) => column.name === 'is_active'
  );

  // Добавяме колоната към съществуващата база
  // Всички досегашни упражнения остават активни
  if (!hasActiveColumn) {
    db.execSync(`
      ALTER TABLE exercises
      ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1
    `);
  }
}

// Взимаме само активните упражнения от каталога
export function getExercises() {
  return db.getAllSync(
    `SELECT *
     FROM exercises
     WHERE is_active = 1
     ORDER BY name ASC`
  );
}

// Добавяме ново упражнение
export function addExercise(name) {
  db.runSync(
    'INSERT INTO exercises (name) VALUES (?)',
    [name]
  );
}

// Редактираме упражнение
export function updateExercise(id, name) {
  db.runSync(
    'UPDATE exercises SET name = ? WHERE id = ?',
    [name, id]
  );
}

// Изтриваме упражнение от каталога
export function deleteExercise(id) {
  db.execSync('BEGIN TRANSACTION');

  try {
    // Проверяваме дали упражнението е използвано
    const usage = db.getFirstSync(
      `SELECT COUNT(*) AS total
       FROM workout_exercises
       WHERE exercise_id = ?`,
      [id]
    );

    if (usage.total > 0) {
      // Ако е използвано, само го скриваме от каталога
      // Историческите тренировки остават непокътнати
      db.runSync(
        'UPDATE exercises SET is_active = 0 WHERE id = ?',
        [id]
      );
    } else {
      // Ако не е използвано, го изтриваме напълно
      db.runSync(
        'DELETE FROM exercises WHERE id = ?',
        [id]
      );
    }

    db.execSync('COMMIT');

    return usage.total > 0 ? 'hidden' : 'deleted';
  } catch (error) {
    db.execSync('ROLLBACK');
    throw error;
  }
}

// Създаваме нова празна тренировка
export function createWorkout() {
  const result = db.runSync(
    'INSERT INTO workouts DEFAULT VALUES'
  );

  return result.lastInsertRowId;
}

// Взимаме конкретна тренировка
export function getWorkout(workoutId) {
  return db.getFirstSync(
    'SELECT * FROM workouts WHERE id = ?',
    [workoutId]
  );
}

// Добавяме упражнение към тренировка
export function addExerciseToWorkout(workoutId, exerciseId) {
  const result = db.runSync(
    `INSERT INTO workout_exercises
      (workout_id, exercise_id)
     VALUES (?, ?)`,
    [workoutId, exerciseId]
  );

  return result.lastInsertRowId;
}

// Изтриваме упражнение от конкретна тренировка
export function deleteExerciseFromWorkout(workoutExerciseId) {
  db.execSync('BEGIN TRANSACTION');

  try {
    db.runSync(
      'DELETE FROM sets WHERE workout_exercise_id = ?',
      [workoutExerciseId]
    );

    db.runSync(
      'DELETE FROM workout_exercises WHERE id = ?',
      [workoutExerciseId]
    );

    db.execSync('COMMIT');
  } catch (error) {
    db.execSync('ROLLBACK');
    throw error;
  }
}

// Изтриваме цяла тренировка от историята
export function deleteWorkout(workoutId) {
  db.execSync('BEGIN TRANSACTION');

  try {
    // Изтриваме сериите към упражненията от тренировката
    db.runSync(
      `DELETE FROM sets
       WHERE workout_exercise_id IN (
         SELECT id
         FROM workout_exercises
         WHERE workout_id = ?
       )`,
      [workoutId]
    );

    // Изтриваме упражненията от тренировката
    db.runSync(
      'DELETE FROM workout_exercises WHERE workout_id = ?',
      [workoutId]
    );

    // Изтриваме самата тренировка
    db.runSync(
      'DELETE FROM workouts WHERE id = ?',
      [workoutId]
    );

    db.execSync('COMMIT');
  } catch (error) {
    db.execSync('ROLLBACK');
    throw error;
  }
}

// Взимаме упражненията в конкретна тренировка
export function getWorkoutExercises(workoutId) {
  return db.getAllSync(
    `SELECT
      workout_exercises.id,
      exercises.name,
      exercises.id AS exercise_id
    FROM workout_exercises
    JOIN exercises
      ON exercises.id = workout_exercises.exercise_id
    WHERE workout_exercises.workout_id = ?
    ORDER BY workout_exercises.id ASC`,
    [workoutId]
  );
}

// Добавяме серия към упражнение
export function addSet(workoutExerciseId, setNumber, reps, weight) {
  db.runSync(
    `INSERT INTO sets
      (workout_exercise_id, set_number, reps, weight)
     VALUES (?, ?, ?, ?)`,
    [workoutExerciseId, setNumber, reps, weight]
  );
}

// Взимаме предишните резултати
// Само от приключени тренировки със записани серии
export function getLastExercisePerformance(exerciseId, currentWorkoutId) {
  return db.getAllSync(
    `SELECT
      workouts.date,
      sets.set_number,
      sets.reps,
      sets.weight
    FROM workout_exercises
    JOIN workouts
      ON workouts.id = workout_exercises.workout_id
    JOIN sets
      ON sets.workout_exercise_id = workout_exercises.id
    WHERE workout_exercises.exercise_id = ?
      AND workouts.completed = 1
      AND workouts.id = (
        SELECT workouts.id
        FROM workout_exercises
        JOIN workouts
          ON workouts.id = workout_exercises.workout_id
        JOIN sets
          ON sets.workout_exercise_id = workout_exercises.id
        WHERE workout_exercises.exercise_id = ?
          AND workouts.id != ?
          AND workouts.completed = 1
        ORDER BY workouts.date DESC, workouts.id DESC
        LIMIT 1
      )
    ORDER BY sets.set_number ASC`,
    [exerciseId, exerciseId, currentWorkoutId]
  );
}

// Взимаме всички записани серии за упражнение
export function getWorkoutSets(workoutExerciseId) {
  return db.getAllSync(
    `SELECT *
     FROM sets
     WHERE workout_exercise_id = ?
     ORDER BY set_number ASC`,
    [workoutExerciseId]
  );
}

// Проверяваме общия брой серии в конкретна тренировка
export function getWorkoutSetCount(workoutId) {
  const result = db.getFirstSync(
    `SELECT COUNT(sets.id) AS total
     FROM workout_exercises
     LEFT JOIN sets
       ON sets.workout_exercise_id = workout_exercises.id
     WHERE workout_exercises.workout_id = ?`,
    [workoutId]
  );

  return result.total;
}

// Редактираме вече записана серия
export function updateSet(id, reps, weight) {
  db.runSync(
    `UPDATE sets
     SET reps = ?, weight = ?
     WHERE id = ?`,
    [reps, weight, id]
  );
}

// Изтриваме серия и преномерираме останалите
export function deleteSet(id, workoutExerciseId, setNumber) {
  db.runSync(
    'DELETE FROM sets WHERE id = ?',
    [id]
  );

  db.runSync(
    `UPDATE sets
     SET set_number = set_number - 1
     WHERE workout_exercise_id = ?
       AND set_number > ?`,
    [workoutExerciseId, setNumber]
  );
}

// Приключваме тренировка
export function finishWorkout(workoutId) {
  db.runSync(
    'UPDATE workouts SET completed = 1 WHERE id = ?',
    [workoutId]
  );
}

// Взимаме историята на приключените тренировки
export function getWorkoutHistory() {
  return db.getAllSync(
    `SELECT *
     FROM workouts
     WHERE completed = 1
     ORDER BY date DESC, id DESC`
  );
}

// Взимаме последната незавършена тренировка
export function getActiveWorkout() {
  return db.getFirstSync(
    `SELECT *
     FROM workouts
     WHERE completed = 0
     ORDER BY id DESC
     LIMIT 1`
  );
}
