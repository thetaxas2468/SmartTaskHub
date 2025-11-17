import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
// Angular v17+: import { output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  // Angular v17+: clickOutside = output<void>();
  @Output() appClickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(target: HTMLElement) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      // Angular v17+: this.clickOutside();
      this.appClickOutside.emit();
    }
  }
}

