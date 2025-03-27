import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroupDirective,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { liveQuery } from 'dexie';
import { db } from '../../../../core/services/database/db';
import { ButtonComponent } from '../../../../core/ui/button/button.component';
import { IconComponent } from '../../../../core/ui/icon/icon.component';
import { InputComponent } from '../../../../core/ui/input/input.component';
import { SelectComponent } from '../../../../core/ui/select/select.component';
import { Option } from '../../../../core/ui/select/select.interface';
import { TextareaComponent } from '../../../../core/ui/textarea/textarea.component';
import { TimeComponent } from '../../../../core/ui/time/time.component';
import { Meal } from '../../facades/feeding-plan/interfaces/feeding-plan.interface';

@Component({
  selector: 'app-meals-form',
  standalone: true,
  imports: [
    TextareaComponent,
    SelectComponent,
    TimeComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    IconComponent,
  ],
  templateUrl: './meals-form.component.html',
  styleUrl: './meals-form.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MealsFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MealsFormComponent),
      multi: true,
    },
  ],
})
export class MealsFormComponent
  implements ControlValueAccessor, OnInit, AfterViewInit
{
  private fb = inject(FormBuilder);

  @Input() required = false;
  @Output() onRemove = new EventEmitter();

  @ViewChild('form')
  form!: FormGroupDirective;

  onChange: any = () => {};
  onTouched: any = () => {};

  formMeals = this.fb.group({
    time: ['08:00', [Validators.required]],
    type: [null, [Validators.required]],
    amount: [100, [Validators.required]],
    unit: [null, [Validators.required]],
    note: [''],
  });

  units$ = liveQuery(() => this.listUnits());
  types$ = liveQuery(() => this.listFeedingTypes());

  active = signal(false);
  value = signal<Meal | null>(null);

  ngOnInit(): void {
    this.formMeals.valueChanges.subscribe((values) => {
      this.onChange(values);
    });
  }
  ngAfterViewInit(): void {
    this.formMeals.markAllAsTouched();
    this.form.onSubmit(null as any);
  }

  writeValue(meal: Meal): void {
    if (meal && meal.id) {
      // TODO: Remover
      // let type = meal.type.id
      //   ? {
      //       value: meal.type.id,
      //       label: meal.type.type,
      //     }
      //   : null;
      // let unit = meal.unit.id
      //   ? {
      //       value: String(meal.unit.id),
      //       label: meal.unit.description,
      //     }
      //   : null;

      this.value.set(meal);
      this.formMeals.reset({
        time: meal.time,
        type: meal.type as any,
        amount: meal.amount,
        unit: meal.unit as any,
        note: meal.note,
      });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggle(event: Event) {
    event.stopPropagation();
    this.active.set(!this.active());
  }

  remove(event: Event) {
    event.stopPropagation();

    const result = window.confirm('Deseja realmente excluir este item?');
    if (result) {
      this.onRemove.emit();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.required && !this.formMeals.valid) {
      return { required: true };
    }
    return null;
  }

  private listFeedingTypes() {
    return db.feedingType.toArray().then((types) => {
      return types.map((t) => {
        const option: Option = {
          label: t.type,
          value: String(t.id),
        };
        return option;
      });
    });
  }

  private listUnits() {
    return db.measurementUnit.toArray().then((units) => {
      return units.map((u) => {
        const option: Option = {
          label: u.unit,
          value: String(u.id),
        };
        return option;
      });
    });
  }
}
