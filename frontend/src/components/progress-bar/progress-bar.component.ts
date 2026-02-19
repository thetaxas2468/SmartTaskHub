import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// Angular v17+: import { input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {
  // Angular v17+: progress = input<number>(0); // 0-100
  @Input() progress: number = 0; // 0-100
  
  // Angular v17+: height = input<string>('8px');
  @Input() height: string = '8px';
  
  // Angular v17+: showLabel = input<boolean>(false);
  @Input() showLabel: boolean = false;
  
  // Angular v17+: label = input<string>('');
  @Input() label: string = '';
}

