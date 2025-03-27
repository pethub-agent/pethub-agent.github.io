import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
// import { PetGender } from '../../../../core/services/database/entity/pet/pet.interface';
import { liveQuery } from 'dexie';
import { PetGender } from '../../../../core/services/database/tables/pet.table';
import { ButtonComponent } from '../../../../core/ui/button/button.component';
import { DateComponent } from '../../../../core/ui/date/date.component';
import { InputComponent } from '../../../../core/ui/input/input.component';
import { PhotoComponent } from '../../../../core/ui/photo/photo.component';
import { SelectComponent } from '../../../../core/ui/select/select.component';
import { Option } from '../../../../core/ui/select/select.interface';
import { RegistrationFacade } from '../../facades/registration/registration.facade';
import { requiredOption } from './validators/required-option.validator';

@Component({
  selector: 'app-register-pet',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    InputComponent,
    SelectComponent,
    ButtonComponent,
    DateComponent,
    PhotoComponent,
  ],
  templateUrl: './register-pet.component.html',
  styleUrl: './register-pet.component.scss',
})
export class RegisterPetComponent implements AfterViewInit {
  private router = inject(Router);
  private registration = inject(RegistrationFacade);
  private fb = inject(FormBuilder);

  species = liveQuery(() => this.findSpecies());
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

    this.registerPet().then(() => this.router.navigate(['login/perfil']));
  }

  private findSpecies() {
    return this.registration.findSpecies().then((species) => {
      return species.map((s) => {
        const option: Option = {
          value: String(s.id),
          label: s.name,
        };
        return option;
      });
    });
  }

  private registerPet() {
    const formPet = this.formPet.value as any;
    return this.registration.registerPet({
      birth: formPet.birth || '',
      breed: formPet.breed || '',
      gender: (formPet.gender?.value || 'M') as PetGender,
      name: formPet.name || '',
      specieId: Number(formPet.specie?.value || ''),
      photo: formPet.photo || '',
    });
  }

  private initForm() {
    // Inicializa os campos do formulário com os dados do pet
    this.registration.pet$.subscribe((pet) => {
      if (pet) {
        this.formPet.reset({
          name: pet?.name || '',
          specie: {
            label: pet.specie?.name || '',
            value: String(pet.specie?.id || ''),
          } as any,
          breed: pet?.breed || '',
          photo: pet.photo || '',
          birth: pet?.birth.toISOString().split('T')[0] || '',
          gender: {
            label: pet?.gender == 'M' ? 'Macho' : 'Femea',
            value: pet?.gender || '',
          } as any,
        });
      }
    });
  }
}
