import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { map, of } from 'rxjs';

type Icon =
  | 'pet'
  | 'plus'
  | 'calendar'
  | 'clock'
  | 'engine'
  | 'bell'
  | 'edit'
  | 'trash'
  | 'close';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  class = input('');
  icon = input<Icon | null>(null);
  size = input<'sm' | 'md' | 'lg'>('md');
  rounded = input(false);
  theme = input<
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'neutral'
    | 'support'
    | 'gradient'
    | 'gradient-primary'
  >('primary');

  source = computed(() => {
    if (!this.icon()) {
      return of('');
    }

    const path = './assets/hero-icon/' + this.icon() + '.svg';
    return this.http.get(path, { responseType: 'text' }).pipe(
      map((svg) => {
        return this.sanitizer.bypassSecurityTrustHtml(svg);
      })
    );
  });

  get iconClasses() {
    const base = {
      'size-5': this.size() == 'sm',
      'size-6': this.size() == 'md',
      'size-12': this.size() == 'lg',
      'text-black': true,
      // 'rounded-full border-2 border-solid p-4': this.rounded(),
    };

    const themes = {
      'bg-primary text-white hover:bg-primary-dark': this.theme() == 'primary',
      'bg-support-blue text-white hover:bg-support-blue':
        this.theme() == 'support',
      'bg-secondary text-black hover:bg-secondary-dark':
        this.theme() == 'secondary',
      'bg-neutral-200 text-neutral-800 hover:bg-neutral-500':
        this.theme() == 'neutral',
      'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:bg-gradient-dark':
        this.theme() == 'gradient',

      'bg-gradient-to-r from-primary to-secondary text-white hover:bg-gradient-dark':
        this.theme() == 'gradient-primary',
      'border-danger-from !text-danger-from ': this.theme() == 'danger',
    };

    return { ...base };
  }
}
