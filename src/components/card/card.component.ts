import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// Angular v17+: import { input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  // Angular v17+: title = input<string>('');
  @Input() title: string = '';
  
  // Angular v17+: badge = input<string | number | null>(null);
  @Input() badge: string | number | null = null;
  
  // Angular v17+: showHeader = input<boolean>(true);
  @Input() showHeader: boolean = true;
}

