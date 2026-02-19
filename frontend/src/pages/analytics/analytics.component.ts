import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Task } from '../../models/task.model';
import { HabitEntry } from '../../models/habit.model';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { FormatNumberPipe } from '../../pipes/format-number.pipe';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { PriorityColorPipe } from '../../pipes/priority-color.pipe';
import { HoverEffectDirective } from '../../directives/hover-effect.directive';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    StatCardComponent, 
    ProgressBarComponent,
    FormatNumberPipe,
    // DateFormatPipe,
    // PriorityColorPipe,
    HoverEffectDirective
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  habitEntries: HabitEntry[] = [];
  private subscriptions = new Subscription();

  // Task Statistics
  taskStats = {
    total: 0,
    completed: 0,
    inProgress: 0,
    highPriority: { total: 0, completed: 0 },
    mediumPriority: { total: 0, completed: 0 },
    lowPriority: { total: 0, completed: 0 }
  };

  // Habit Statistics
  habitStats = {
    totalDaysTracked: 0,
    averageWaterIntake: 0,
    averageExercise: 0,
    averageReading: 0,
    monthlyAverages: [] as { month: string; waterIntake: number; exercise: number; reading: number }[]
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Subscribe to tasks
    this.subscriptions.add(
      this.dataService.getTasksObservable().subscribe(tasks => {
        this.tasks = tasks;
        this.calculateTaskStats();
      })
    );

    // Subscribe to habits
    this.subscriptions.add(
      this.dataService.getHabitsObservable().subscribe(habits => {
        if (habits) {
          this.habitEntries = habits.entries;
          this.calculateHabitStats();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  calculateTaskStats() {
    this.taskStats.total = this.tasks.length;
    this.taskStats.completed = this.tasks.filter(t => t.completed).length;
    this.taskStats.inProgress = this.tasks.filter(t => !t.completed).length;

    // Priority breakdown
    const highPriorityTasks = this.tasks.filter(t => t.priority === 'high');
    const mediumPriorityTasks = this.tasks.filter(t => t.priority === 'medium');
    const lowPriorityTasks = this.tasks.filter(t => t.priority === 'low');

    this.taskStats.highPriority = {
      total: highPriorityTasks.length,
      completed: highPriorityTasks.filter(t => t.completed).length
    };

    this.taskStats.mediumPriority = {
      total: mediumPriorityTasks.length,
      completed: mediumPriorityTasks.filter(t => t.completed).length
    };

    this.taskStats.lowPriority = {
      total: lowPriorityTasks.length,
      completed: lowPriorityTasks.filter(t => t.completed).length
    };
  }

  calculateHabitStats() {
    if (this.habitEntries.length === 0) {
      this.habitStats.totalDaysTracked = 0;
      this.habitStats.averageWaterIntake = 0;
      this.habitStats.averageExercise = 0;
      this.habitStats.averageReading = 0;
      return;
    }

    this.habitStats.totalDaysTracked = this.habitEntries.length;

    // Calculate overall averages
    const totalWater = this.habitEntries.reduce((sum, e) => sum + e.waterIntake, 0);
    const totalExercise = this.habitEntries.reduce((sum, e) => sum + e.exercise, 0);
    const totalReading = this.habitEntries.reduce((sum, e) => sum + e.reading, 0);

    this.habitStats.averageWaterIntake = totalWater / this.habitEntries.length;
    this.habitStats.averageExercise = totalExercise / this.habitEntries.length;
    this.habitStats.averageReading = totalReading / this.habitEntries.length;

    // Calculate monthly averages
    const monthlyData = new Map<string, { waterIntake: number[]; exercise: number[]; reading: number[] }>();

    this.habitEntries.forEach(entry => {
      const date = new Date(entry.date);
      const month = date.getMonth() + 1;
      const monthKey = `${date.getFullYear()}-${month < 10 ? '0' + month : month}`;

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { waterIntake: [], exercise: [], reading: [] });
      }

      const monthData = monthlyData.get(monthKey)!;
      monthData.waterIntake.push(entry.waterIntake);
      monthData.exercise.push(entry.exercise);
      monthData.reading.push(entry.reading);
    });

    this.habitStats.monthlyAverages = Array.from(monthlyData.entries()).map(([key, data]) => ({
      month: new Date(key + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      waterIntake: data.waterIntake.reduce((a, b) => a + b, 0) / data.waterIntake.length,
      exercise: data.exercise.reduce((a, b) => a + b, 0) / data.exercise.length,
      reading: data.reading.reduce((a, b) => a + b, 0) / data.reading.length
    }));
  }

  getCompletionPercentage(completed: number, total: number): number {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }
}

