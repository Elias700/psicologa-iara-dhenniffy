import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';
import { ScrollAnimationService } from './core/animations/scroll-animation.service';

/** Stub: nos testes não carregamos GSAP/Lenis (import dinâmico só no navegador real). */
class ScrollAnimationStub {
  readonly libs = signal(null);
  initOnIntent = () => undefined;
  enqueue = (task: () => void) => task();
  scheduleRefresh = () => undefined;
  scrollToSection = () => undefined;
  setScrollLocked = () => undefined;
  isWide = () => false;
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), { provide: ScrollAnimationService, useClass: ScrollAnimationStub }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the skip link', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.skip-link')?.textContent).toContain('Pular para o conteúdo');
  });

  it('should render the section navigation in the header', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('.nav .nav-link');
    expect(links.length).toBeGreaterThan(0);
  });
});
