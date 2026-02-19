import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priorityColor',
  standalone: true
})
export class PriorityColorPipe implements PipeTransform {
  transform(priority: 'high' | 'medium' | 'low'): string {
    const colors = {
      high: 'var(--danger)',
      medium: 'var(--warning)',
      low: 'var(--text-secondary)'
    };
    return colors[priority] || colors.low;
  }
}

