import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber',
  standalone: true
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: number, decimals: number = 1, unit: string = ''): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0' + (unit ? unit : '');
    }
    const formatted = value.toFixed(decimals);
    return formatted + (unit ? unit : '');
  }
}

