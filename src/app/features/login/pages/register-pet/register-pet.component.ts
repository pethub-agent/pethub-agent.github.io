import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../core/ui/button/button.component';
import { DateComponent } from '../../../../core/ui/date/date.component';
import { InputComponent } from '../../../../core/ui/input/input.component';
import { SelectComponent } from '../../../../core/ui/select/select.component';
import { Option } from '../../../../core/ui/select/select.interface';
import { RegistrationFacade } from '../../facades/registration/registration.facade';
import { requiredOption } from './validator';

@Component({
  selector: 'app-register-pet',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    ButtonComponent,
    DateComponent,
  ],
  templateUrl: './register-pet.component.html',
  styleUrl: './register-pet.component.scss',
})
export class RegisterPetComponent implements AfterViewInit {
  private router = inject(Router);
  private registration = inject(RegistrationFacade);
  private fb = inject(FormBuilder);

  species = signal<Option[]>([]);
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
  });
  errorFieldRequired = signal(false);

  ngAfterViewInit(): void {
    this.initData();
  }

  onSubmit() {
    console.log(this.formPet.value);

    this.errorFieldRequired.set(false);

    if (!this.formPet.valid) {
      this.errorFieldRequired.set(true);
      return;
    }
    this.registration
      .registerPet({
        birth: this.formPet.value.birth || '',
        breed: this.formPet.value.breed || '',
        gender: this.formPet.value.gender?.value || 'M',
        name: this.formPet.value.name || '',
        specieId: Number(this.formPet.value.specie?.value || ''),
      })
      .then(() => {
        this.router.navigate(['login/perfil']);
      });
  }

  private initData() {
    // Lista as espécies disponíveis
    this.registration.listSpecies().then((data) => {
      const result = data.map((d) => {
        const op: Option = {
          value: d.id,
          label: d.name,
        };
        return op;
      });
      this.species.set(result);
    });

    // Inicializa os campos do formulário com os dados do pet
    const pet = this.registration.store.value.pet;
    this.formPet.reset({
      name: pet?.name || '',
      specie: {
        label: pet?.specie.name || '',
        value: String(pet?.specie.id || ''),
      },
      breed: pet?.breed || '',
      birth: pet?.birth.toISOString().split('T')[0] || '',
      gender: {
        label: pet?.gender == 'M' ? 'Macho' : 'Femea',
        value: pet?.gender || '',
      },
    });
  }
}
