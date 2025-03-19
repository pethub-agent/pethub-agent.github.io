import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type AvatarSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @Input()
  src = '';

  @Input()
  size: AvatarSize = 'md';

  onImageError() {
    this.src = '';
  }
}
