export interface HabitEntry {
  date: string; // Format: YYYY-MM-DD
  waterIntake: number; // in liters
  exercise: number; // in minutes
  reading: number; // in minutes
}

export interface HabitsData {
  targets: {
    waterIntake: number;
    exercise: number;
    reading: number;
  };
  entries: HabitEntry[];
}

