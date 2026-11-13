
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
  `);
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
