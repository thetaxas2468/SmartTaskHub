import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
// Angular v17+: import { input } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true
})
export class AutoFocusDirective implements AfterViewInit {
  // Angular v17+: enabled = input<boolean>(true);
  @Input() appAutoFocus: boolean | string = true;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    if (this.appAutoFocus) {
      // Small delay to ensure the element is fully rendered
      setTimeout(() => {
        this.elementRef.nativeElement.focus();
      }, 0);
    }
  }
}

