import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Task } from '../../models/task.model';
import { DataService } from '../../services/data.service';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { CardComponent } from '../../components/card/card.component';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { ButtonComponent } from '../../components/button/button.component';
import { FormatNumberPipe } from '../../pipes/format-number.pipe';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { PriorityColorPipe } from '../../pipes/priority-color.pipe';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { AutoFocusDirective } from '../../directives/auto-focus.directive';
import { HoverEffectDirective } from '../../directives/hover-effect.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    StatCardComponent,
    CardComponent,
    ProgressBarComponent,
    ButtonComponent,
    FormatNumberPipe,
    DateFormatPipe,
    PriorityColorPipe,
    ClickOutsideDirective,
    AutoFocusDirective,
    HoverEffectDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  selectedDate: string = '';
  habits: { name: string; progress: number; target: number; current: number }[] = [];
  
  // Modal states
  showAddTaskModal = false;
  showTrackHabitModal = false;
  
  // Form data
  newTask = {
    title: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  };
  
  newHabit = {
    waterIntake: 0,
    exercise: 0,
    reading: 0
  };
  
  habitTargets = {
    waterIntake: 8,
    exercise: 30,
    reading: 60
  };
  
  habitErrors = {
    waterIntake: '',
    exercise: '',
    reading: ''
  };
  
  private subscriptions = new Subscription();
  
  stats = [
    { label: 'Total Tasks', value: 0, icon: '📋', color: 'var(--primary)' },
    { label: 'In Progress', value: 0, icon: '🔄', color: 'var(--warning)' }
  ];

  quickActions = [
    { label: 'Add Task', icon: '➕', action: 'addTask' },
    { label: 'Track Habit', icon: '✅', action: 'trackHabit' }
  ];
  
  get inProgressTasks(): Task[] {
    return this.tasks.filter(task => !task.completed);
  }

  getTodayDateString(): string {
    return new Date().toLocaleDateString();
  }

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Set default date to today
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
    
    // Subscribe to tasks
    this.subscriptions.add(
      this.dataService.getTasksObservable().subscribe(tasks => {
        this.tasks = tasks;
        this.calculateStats();
        this.updateJsonFile();
      })
    );

    // Subscribe to habits
    this.subscriptions.add(
      this.dataService.getHabitsObservable().subscribe(habits => {
        if (habits) {
          this.loadHabitsForDate(this.selectedDate);
        }
      })
    );

    // Load habits for initial date
    this.loadHabitsForDate(this.selectedDate);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  calculateStats() {
    const total = this.tasks.length;
    const inProgress = this.tasks.filter(task => !task.completed).length;

    this.stats[0].value = total;
    this.stats[1].value = inProgress;
  }

  onTaskToggle(task: Task) {
    // Delete task when marked as completed
    if (!task.completed) {
      this.dataService.deleteTask(task.id);
      this.updateJsonFile();
    }
  }

  onDateChange() {
    this.loadHabitsForDate(this.selectedDate);
  }

  loadHabitsForDate(date: string) {
    const habitEntry = this.dataService.getHabitEntry(date);
    const targets = this.dataService.getHabitTargets();
    
    if (habitEntry) {
      this.habits = [
        {
          name: '💧 Water Intake',
          current: habitEntry.waterIntake,
          target: targets.waterIntake,
          progress: Math.round((habitEntry.waterIntake / targets.waterIntake) * 100)
        },
        {
          name: '🏃 Exercise',
          current: habitEntry.exercise,
          target: targets.exercise,
          progress: Math.round((habitEntry.exercise / targets.exercise) * 100)
        },
        {
          name: '📚 Reading',
          current: habitEntry.reading,
          target: targets.reading,
          progress: Math.round((habitEntry.reading / targets.reading) * 100)
        }
      ];
    } else {
      // No data for selected date, show zeros
      this.habits = [
        {
          name: '💧 Water Intake',
          current: 0,
          target: targets.waterIntake,
          progress: 0
        },
        {
          name: '🏃 Exercise',
          current: 0,
          target: targets.exercise,
          progress: 0
        },
        {
          name: '📚 Reading',
          current: 0,
          target: targets.reading,
          progress: 0
        }
      ];
    }
  }

  handleAction(action: string) {
    if (action === 'addTask') {
      this.showAddTaskModal = true;
    } else if (action === 'trackHabit') {
      this.openTrackHabitModal();
    }
  }

  closeAddTaskModal() {
    this.showAddTaskModal = false;
    this.newTask = { title: '', priority: 'medium' };
  }

  closeTrackHabitModal() {
    this.showTrackHabitModal = false;
    this.newHabit = { waterIntake: 0, exercise: 0, reading: 0 };
    this.clearHabitErrors();
  }

  saveTask() {
    if (this.newTask.title.trim()) {
      const maxId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) : 0;
      const newTask: Task = {
        id: maxId + 1,
        title: this.newTask.title.trim(),
        completed: false,
        priority: this.newTask.priority
      };
      this.dataService.addTask(newTask);
      this.updateJsonFile();
      this.closeAddTaskModal();
    }
  }

  saveHabit() {
    // Validate all inputs before saving
    this.validateHabitInput('waterIntake', this.newHabit.waterIntake);
    this.validateHabitInput('exercise', this.newHabit.exercise);
    this.validateHabitInput('reading', this.newHabit.reading);
    
    if (!this.isHabitFormValid()) {
      return; // Don't save if validation fails
    }
    
    const today = new Date().toISOString().split('T')[0];
    const habitEntry = {
      date: today,
      waterIntake: this.newHabit.waterIntake,
      exercise: this.newHabit.exercise,
      reading: this.newHabit.reading
    };
    this.dataService.addOrUpdateHabitEntry(habitEntry);
    this.selectedDate = today;
    this.loadHabitsForDate(today);
    this.updateHabitsJsonFile();
    this.closeTrackHabitModal();
  }

  openTrackHabitModal() {
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = this.dataService.getHabitEntry(today);
    this.habitTargets = this.dataService.getHabitTargets();
    
    if (existingEntry) {
      this.newHabit = {
        waterIntake: existingEntry.waterIntake,
        exercise: existingEntry.exercise,
        reading: existingEntry.reading
      };
    } else {
      this.newHabit = { waterIntake: 0, exercise: 0, reading: 0 };
    }
    
    this.clearHabitErrors();
    this.showTrackHabitModal = true;
  }
  
  validateHabitInput(field: 'waterIntake' | 'exercise' | 'reading', value: number): void {
    const target = this.habitTargets[field];
    this.habitErrors[field] = '';
    
    if (value < 0) {
      this.habitErrors[field] = 'Value cannot be negative';
    } else if (value > target) {
      this.habitErrors[field] = `Value cannot exceed ${target} ${field === 'waterIntake' ? 'liters' : 'minutes'}`;
    }
  }
  
  clearHabitErrors(): void {
    this.habitErrors = {
      waterIntake: '',
      exercise: '',
      reading: ''
    };
  }
  
  isHabitFormValid(): boolean {
    return !this.habitErrors.waterIntake && 
           !this.habitErrors.exercise && 
           !this.habitErrors.reading &&
           this.newHabit.waterIntake >= 0 && 
           this.newHabit.waterIntake <= this.habitTargets.waterIntake &&
           this.newHabit.exercise >= 0 && 
           this.newHabit.exercise <= this.habitTargets.exercise &&
           this.newHabit.reading >= 0 && 
           this.newHabit.reading <= this.habitTargets.reading;
  }

  updateJsonFile() {
    // Export tasks JSON for download/update
    const tasksJson = this.dataService.exportTasksToJson();
    // In a real app, you'd send this to a backend to update the file
    // For now, we'll store it in localStorage and provide download functionality
    console.log('Updated tasks JSON:', tasksJson);
  }

  updateHabitsJsonFile() {
    // Export habits JSON for download/update
    const habitsJson = this.dataService.exportHabitsToJson();
    console.log('Updated habits JSON:', habitsJson);
  }

  downloadTasksJson() {
    const json = this.dataService.exportTasksToJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  downloadHabitsJson() {
    const json = this.dataService.exportHabitsToJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'habits.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}

