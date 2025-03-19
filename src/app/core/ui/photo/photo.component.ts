import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  forwardRef,
  Injector,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';

@Component({
  selector: 'app-photo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhotoComponent),
      multi: true,
    },
  ],
})
export class PhotoComponent implements ControlValueAccessor, OnInit {
  @Input()
  label = '';

  @Input()
  disabled = false;

  @ViewChild('fileInput')
  input?: ElementRef;

  src: string | null = null;

  onChange: any = () => {};
  onTouched: any = () => {};

  control: NgControl | null = null;
  group: FormGroupDirective | null = null;

  get error() {
    if (this.control?.errors && this.group?.submitted) {
      if (this.control.errors['required']) {
        return 'Este campo é obrigatório.';
      }
    }
    return '';
  }

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    this.group = this.injector.get(FormGroupDirective, null);
    this.control = this.injector.get(NgControl, null);
  }

  writeValue(value: string): void {
    if (value) {
      this.src = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  removeImage() {
    this.src = null;

    // Reset the file input value to trigger the onFileSelected method again
    const fileInput = this.input?.nativeElement;
    if (fileInput) {
      fileInput.value = ''; // Reset input value to trigger re-selection
    }
    this.onChange(null);
  }

  // Trigger file input to open file picker
  triggerFileInput() {
    const fileInput = this.input?.nativeElement;

    fileInput.click();
  }

  // Handle file selection and display photo preview
  onFileSelected(event: Event) {
    const input = this.input?.nativeElement;
    if (input?.files?.length) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.src = reader.result as string;
        this.onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
}
