import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { HabitEntry, HabitsData } from '../models/habit.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private tasksKey = 'smartTaskApp_tasks';
  private habitsKey = 'smartTaskApp_habits';
  
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  private habitsSubject = new BehaviorSubject<HabitsData | null>(null);
  public habits$ = this.habitsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeData();
  }

  private initializeData() {
    // Load tasks
    const savedTasks = this.getTasksFromStorage();
    if (savedTasks.length > 0) {
      this.tasksSubject.next(savedTasks);
    } else {
      this.loadTasksFromJson().subscribe();
    }

    // Load habits
    const savedHabits = this.getHabitsFromStorage();
    if (savedHabits) {
      this.habitsSubject.next(savedHabits);
    } else {
      this.loadHabitsFromJson().subscribe();
    }
  }

  // Tasks Methods
  loadTasksFromJson(): Observable<Task[]> {
    return this.http.get<Task[]>('/assets/data/tasks.json').pipe(
      tap(tasks => {
        this.saveTasksToStorage(tasks);
        this.tasksSubject.next(tasks);
      }),
      catchError(error => {
        console.error('Error loading tasks from JSON:', error);
        return of([]);
      })
    );
  }

  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  getTasksObservable(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(task: Task): void {
    const tasks = [...this.tasksSubject.value, task];
    this.saveTasksToStorage(tasks);
    this.tasksSubject.next(tasks);
  }

  updateTask(updatedTask: Task): void {
    const tasks = this.tasksSubject.value.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.saveTasksToStorage(tasks);
    this.tasksSubject.next(tasks);
  }

  deleteTask(taskId: number): void {
    const tasks = this.tasksSubject.value.filter(task => task.id !== taskId);
    this.saveTasksToStorage(tasks);
    this.tasksSubject.next(tasks);
  }

  private saveTasksToStorage(tasks: Task[]): void {
    localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
  }

  private getTasksFromStorage(): Task[] {
    const stored = localStorage.getItem(this.tasksKey);
    return stored ? JSON.parse(stored) : [];
  }

  exportTasksToJson(): string {
    return JSON.stringify(this.tasksSubject.value, null, 2);
  }

  // Habits Methods
  loadHabitsFromJson(): Observable<HabitsData> {
    return this.http.get<HabitsData>('/assets/data/habits.json').pipe(
      tap(habits => {
        this.saveHabitsToStorage(habits);
        this.habitsSubject.next(habits);
      }),
      catchError(error => {
        console.error('Error loading habits from JSON:', error);
        return of({
          targets: { waterIntake: 8, exercise: 30, reading: 60 },
          entries: []
        });
      })
    );
  }

  getHabits(): HabitsData | null {
    return this.habitsSubject.value;
  }

  getHabitsObservable(): Observable<HabitsData | null> {
    return this.habits$;
  }

  getHabitEntry(date: string): HabitEntry | null {
    const habits = this.habitsSubject.value;
    if (!habits) return null;
    return habits.entries.find(entry => entry.date === date) || null;
  }

  addOrUpdateHabitEntry(entry: HabitEntry): void {
    const habits = this.habitsSubject.value;
    if (!habits) return;

    const existingIndex = habits.entries.findIndex(e => e.date === entry.date);
    let updatedEntries: HabitEntry[];

    if (existingIndex >= 0) {
      updatedEntries = [...habits.entries];
      updatedEntries[existingIndex] = entry;
    } else {
      updatedEntries = [...habits.entries, entry];
    }

    const updatedHabits: HabitsData = {
      ...habits,
      entries: updatedEntries
    };

    this.saveHabitsToStorage(updatedHabits);
    this.habitsSubject.next(updatedHabits);
  }

  getHabitTargets() {
    const habits = this.habitsSubject.value;
    return habits?.targets || { waterIntake: 8, exercise: 30, reading: 60 };
  }

  private saveHabitsToStorage(habits: HabitsData): void {
    localStorage.setItem(this.habitsKey, JSON.stringify(habits));
  }

  private getHabitsFromStorage(): HabitsData | null {
    const stored = localStorage.getItem(this.habitsKey);
    return stored ? JSON.parse(stored) : null;
  }

  exportHabitsToJson(): string {
    return JSON.stringify(this.habitsSubject.value, null, 2);
  }
}

