import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, StatCardComponent, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  
  features = [
    {
      icon: '📋',
      title: 'Task Management',
      description: 'Create, organize, and track your tasks with priorities, due dates, and categories.',
      route: '/dashboard'
    },
    {
      icon: '✅',
      title: 'Habit Tracker',
      description: 'Build daily habits with streak tracking and progress visualization.',
      route: '/dashboard'
    },
    {
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'View your productivity trends with beautiful charts and statistics.',
      route: '/analytics'
    }
  ];

  stats = [
    { label: 'Total Tasks', value: '0', color: 'var(--primary)' },
    { label: 'Completed Tasks', value: '0', color: 'var(--success)' },
    { label: 'Habits Tracked', value: '0', color: 'var(--accent)' }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Subscribe to tasks
    this.subscriptions.add(
      this.dataService.getTasksObservable().subscribe(tasks => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        this.stats[0].value = total.toString();
        this.stats[1].value = completed.toString();
      })
    );

    // Subscribe to habits
    this.subscriptions.add(
      this.dataService.getHabitsObservable().subscribe(habits => {
        if (habits) {
          const habitsTracked = habits.entries.length;
          this.stats[2].value = habitsTracked.toString();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

