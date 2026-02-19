import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
// Angular v17+: import { input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  // Angular v17+: type = input<'primary' | 'secondary'>('primary');
  @Input() type: 'primary' | 'secondary' = 'primary';
  
  // Angular v17+: disabled = input<boolean>(false);
  @Input() disabled: boolean = false;
  
  // Angular v17+: size = input<'small' | 'medium' | 'large'>('medium');
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  
  // Angular v17+: fullWidth = input<boolean>(false);
  @Input() fullWidth: boolean = false;
  
  // Angular v17+: clicked = output<void>();
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      // Angular v17+: this.clicked();
      this.clicked.emit();
    }
  }
}

