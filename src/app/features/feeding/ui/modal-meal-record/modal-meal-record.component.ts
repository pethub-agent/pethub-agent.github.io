import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import moment from 'moment';
import { ButtonComponent } from '../../../../core/ui/button/button.component';
import { InputComponent } from '../../../../core/ui/input/input.component';
import { SelectComponent } from '../../../../core/ui/select/select.component';
import { Option } from '../../../../core/ui/select/select.interface';
import { TextareaComponent } from '../../../../core/ui/textarea/textarea.component';
import { TimeComponent } from '../../../../core/ui/time/time.component';
import { requiredOption } from '../../../login/pages/register-pet/validators/required-option.validator';
import { MealRecordFacade } from '../../facades/meal-record/meal-record.facade';
import { PetFacade } from '../../facades/pet/pet.facade';
import { PetView } from '../../facades/pet/view/pet.view';

@Component({
  selector: 'app-modal-meal-record',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    SelectComponent,
    TimeComponent,
    TextareaComponent,
    ButtonComponent,
  ],
  templateUrl: './modal-meal-record.component.html',
  styleUrl: './modal-meal-record.component.scss',
})
export class ModalMealRecordComponent {
  private mealRecordFacade = inject(MealRecordFacade);
  private petFacade = inject(PetFacade);
  private fb = inject(FormBuilder);

  @Input() feedingPlanId: number | null = null;
  @Output() closed = new EventEmitter<void>();

  mealForm: FormGroup = this.fb.group({
    feedingType: [null, [requiredOption()]],
    amount: [0, [Validators.required]],
    unit: [null, [requiredOption()]],
    time: [moment().format('hh:mm'), [Validators.required]],
    note: [''],
  });

  isOpen = signal(false);
  pet = signal<PetView | null>(null);
  feedingTypes = signal<Option[]>([]);
  units = signal<Option[]>([]);

  open(petId: number) {
    this.petFacade.findPet(petId).then((pet) => {
      this.pet.set(pet);
      this.isOpen.set(true);
      this.initialize();
    });
  }

  close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  onSubmit(): void {
    if (this.mealForm.valid) {
      const value = this.mealForm.value;
      this.mealRecordFacade
        .addMealRecord(Number(this.pet()?.id), {
          feedingType: {
            value: value.feedingType.value,
            label: value.feedingType.label,
          },
          amount: value.amount,
          unit: {
            value: value.unit.value,
            label: value.unit.label,
          },
          time: value.time,
          note: value.note,
        })
        .then(() => this.close());
    }
  }

  private initialize() {
    // Inicia dados dos select
    Promise.all([
      this.mealRecordFacade.listFeedingType(),
      this.mealRecordFacade.listUnits(),
    ]).then(([types, units]) => {
      // unidade de medida
      this.units.set(
        units.map((u) => {
          const option: Option = {
            value: String(u.id),
            label: u.description,
          };
          return option;
        })
      );
      // tipos de alimentação,
      this.feedingTypes.set(
        types.map((u) => {
          const option: Option = {
            value: String(u.id),
            label: u.description,
          };
          return option;
        })
      );

      // Inicia formulario, captura o template mais proximo do horario
      this.mealRecordFacade
        .findMealTemplate(Number(this.pet()?.id), new Date())
        .then((template) => {
          this.mealForm.reset({
            feedingType: {
              value: template?.type.value,
              label: template?.type.label,
            },
            amount: template?.amount,
            unit: {
              value: template?.unit.value,
              label: template?.unit.label,
            },
            time: moment().format('hh:mm'),
            note: '',
          });
        });
    });
  }
}
