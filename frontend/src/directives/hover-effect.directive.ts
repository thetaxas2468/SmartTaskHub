import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
// Angular v17+: import { input } from '@angular/core';

@Directive({
  selector: '[appHoverEffect]',
  standalone: true
})
export class HoverEffectDirective {
  // Angular v17+: effect = input<'lift' | 'scale' | 'glow'>('lift');
  @Input() appHoverEffect: 'lift' | 'scale' | 'glow' = 'lift';

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    const element = this.elementRef.nativeElement;
    
    switch (this.appHoverEffect) {
      case 'lift':
        this.renderer.setStyle(element, 'transform', 'translateY(-4px)');
        this.renderer.setStyle(element, 'transition', 'transform 0.2s ease');
        break;
      case 'scale':
        this.renderer.setStyle(element, 'transform', 'scale(1.05)');
        this.renderer.setStyle(element, 'transition', 'transform 0.2s ease');
        break;
      case 'glow':
        this.renderer.setStyle(element, 'box-shadow', '0 0 20px rgba(102, 126, 234, 0.4)');
        this.renderer.setStyle(element, 'transition', 'box-shadow 0.2s ease');
        break;
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    const element = this.elementRef.nativeElement;
    this.renderer.removeStyle(element, 'transform');
    this.renderer.removeStyle(element, 'box-shadow');
  }
}

