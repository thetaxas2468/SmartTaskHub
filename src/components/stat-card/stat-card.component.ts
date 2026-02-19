import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// Angular v17+: import { input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.css']
})
export class StatCardComponent {
  // Angular v17+: icon = input<string>('');
  @Input() icon: string = '';
  
  // Angular v17+: value = input<string | number>('');
  @Input() value: string | number = '';
  
  // Angular v17+: label = input<string>('');
  @Input() label: string = '';
  
  // Angular v17+: color = input<string>('var(--primary)');
  @Input() color: string = 'var(--primary)';
}

