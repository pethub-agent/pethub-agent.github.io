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
import { requiredOption } from './validator';

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
    specie: [{ label: '', value: '' }, [requiredOption()]],
    breed: [''],
    birth: ['', Validators.required],
    gender: [{ label: '', value: '' }, [requiredOption()]],
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
    return this.registration.registerPet({
      birth: this.formPet.value.birth || '',
      breed: this.formPet.value.breed || '',
      gender: (this.formPet.value.gender?.value || 'M') as PetGender,
      name: this.formPet.value.name || '',
      specieId: Number(this.formPet.value.specie?.value || ''),
      photo: this.formPet.value.photo || '',
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
          },
          breed: pet?.breed || '',
          photo: pet.photo || '',
          birth: pet?.birth.toISOString().split('T')[0] || '',
          gender: {
            label: pet?.gender == 'M' ? 'Macho' : 'Femea',
            value: pet?.gender || '',
          },
        });
      }
    });
  }
}
