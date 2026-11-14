
import * as SQLite from 'expo-sqlite';

// Отваряме или създаваме базата данни
export const db = SQLite.openDatabaseSync('workouts.db');

// Създаваме таблицата за упражненията

export function initializeDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
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
}


// Взимаме всички упражнения
export function getExercises() {
  return db.getAllSync(
    'SELECT * FROM exercises ORDER BY name ASC'
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


// Взимаме сериите от последната тренировка,
// в която е участвало дадено упражнение
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
      AND workouts.id = (
        SELECT workouts.id
        FROM workout_exercises
        JOIN workouts
          ON workouts.id = workout_exercises.workout_id
        WHERE workout_exercises.exercise_id = ?
          AND workouts.id != ?
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

// Редактираме вече записана серия
export function updateSet(id, reps, weight) {
  db.runSync(
    `UPDATE sets
     SET reps = ?, weight = ?
     WHERE id = ?`,
    [reps, weight, id]
  );
}

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