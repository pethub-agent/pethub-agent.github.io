import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { PetGender } from '../../../../core/services/database/tables/pet.table';
import { ButtonComponent } from '../../../../core/ui/button/button.component';
import { DateComponent } from '../../../../core/ui/date/date.component';
import { InputComponent } from '../../../../core/ui/input/input.component';
import { PhotoComponent } from '../../../../core/ui/photo/photo.component';
import { SelectComponent } from '../../../../core/ui/select/select.component';
import { Option } from '../../../../core/ui/select/select.interface';
import { requiredOption } from '../../../login/pages/register-pet/validators/required-option.validator';
import { PetFacade } from '../../facades/pet/pet.facade';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SelectComponent,
    PhotoComponent,
    InputComponent,
    DateComponent,
    ButtonComponent,
  ],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss',
})
export class PetFormComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private petFacade = inject(PetFacade);

  petId = signal<number | null>(null);
  title = signal<string>('');
  species = signal<Option[]>([]);
  gender = signal<Option[]>([
    { label: 'Macho', value: 'M' },
    { label: 'Fêmea', value: 'F' },
  ]);
  formPet = this.fb.group({
    name: ['', Validators.required],
    specie: [null, [requiredOption()]],
    breed: [''],
    birth: ['', Validators.required],
    gender: [null, [requiredOption()]],
    photo: [''],
  });
  errorFieldRequired = signal(false);

  ngAfterViewInit(): void {
    this.initForm();
  }

  onSubmit() {
    this.errorFieldRequired.set(false);

    if (!this.formPet.valid) {
      this.errorFieldRequired.set(true);
      return;
    }

    const isEdit = !!this.petId();

    const formPet = this.formPet.value;
    const specie: Option = formPet.specie as any;
    const gender: Option = formPet.gender as any;
    let source$: Promise<any>;
    if (isEdit) {
      source$ = this.petFacade.updatePet({
        id: Number(this.petId()),
        specieId: Number(specie.value),
        name: formPet.name || '',
        breed: formPet.breed || '',
        birth: moment(formPet.birth).toDate(),
        gender: String(gender.value) as PetGender,
        photo: formPet.photo || '',
      });
    } else {
      const pet = this.formPet.value;
      source$ = this.petFacade.addPet({
        id: Number(this.petId()),
        specieId: Number(specie.value),
        name: formPet.name || '',
        breed: formPet.breed || '',
        birth: moment(formPet.birth).toDate(),
        gender: String(gender.value) as PetGender,
        photo: formPet.photo || '',
      });
    }

    source$.then(() => {
      this.back();
    });
  }

  back() {
    history.back();
  }

  private initForm() {
    this.petId.set(Number(this.activatedRoute.snapshot.params['id']) || null);
    // Carrega especies

    this.petFacade.listSpecies().then((species) => {
      const data = species.map((s) => {
        const option: Option = {
          label: s.name,
          value: String(s.id),
        };
        return option;
      });
      this.species.set(data);
    });

    // Carrega formulario
    const isEdit = !!this.petId();
    if (!isEdit) {
      this.title.set('Adicionar Pet');
      this.formPet.reset({
        name: '',
        specie: null,
        breed: '',
        birth: '',
        gender: null,
        photo: '',
      });
    } else {
      this.title.set('Editar Pet');

      this.petFacade.findPet(this.petId()!).then((pet) => {
        if (pet) {
          this.formPet.reset({
            name: pet.name || '',
            breed: pet.breed || '',
            photo: pet.photoUrl || '',
            birth: pet.birthDate.toISOString().split('T')[0] || '',
            specie: {
              label: pet.specie.label,
              value: pet.specie.value,
            } as any,
            gender: {
              label: pet.gender.label,
              value: pet.gender.value,
            } as any,
          });
        }
      });
    }
  }
}
