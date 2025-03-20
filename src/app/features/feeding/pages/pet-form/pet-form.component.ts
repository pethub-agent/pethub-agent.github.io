import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { liveQuery } from 'dexie';
import moment from 'moment';
import { db } from '../../../../core/services/database/db';
import { PetGender } from '../../../../core/services/database/tables/pet.table';
import { JwtService } from '../../../../core/services/jwt/jwt.service';
import { ButtonComponent } from '../../../../core/ui/button/button.component';
import { DateComponent } from '../../../../core/ui/date/date.component';
import { InputComponent } from '../../../../core/ui/input/input.component';
import { PhotoComponent } from '../../../../core/ui/photo/photo.component';
import { SelectComponent } from '../../../../core/ui/select/select.component';
import { Option } from '../../../../core/ui/select/select.interface';
import { requiredOption } from '../../../login/pages/register-pet/validator';

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
  private jwt = inject(JwtService);

  petId = signal<number | null>(null);
  title = signal<string>('');
  species = liveQuery(() =>
    db.specie.toArray().then((d) =>
      d.map((s) => {
        const option: Option = {
          label: s.name,
          value: Number(s.id),
        };
        return option;
      })
    )
  );
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

    const isEdit = !!this.petId();
    const token = this.jwt.decode();
    let source$: Promise<any>;
    if (isEdit) {
      const pet = this.formPet.value;
      source$ = db.pet.update(Number(this.petId()), {
        birthDate: moment(pet.birth).toDate(),
        gender: pet.gender?.value as PetGender,
        name: pet.name || '',
        specieId: Number(pet.specie?.value),
        breed: pet.breed || '',
        ownerId: token?.sub,
        photoUrl: pet.photo || '',
      });
    } else {
      const pet = this.formPet.value;
      source$ = db.pet.add({
        birthDate: moment(pet.birth).toDate(),
        gender: pet.gender?.value as PetGender,
        name: pet.name || '',
        specieId: Number(pet.specie?.value),
        breed: pet.breed || '',
        ownerId: token?.sub,
        photoUrl: pet.photo || '',
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

    const isEdit = !!this.petId();
    if (!isEdit) {
      this.title.set('Adicionar Pet');
      this.formPet.reset({
        name: '',
        specie: { label: '', value: '' },
        breed: '',
        birth: '',
        gender: { label: '', value: '' },
        photo: '',
      });
    } else {
      this.title.set('Editar Pet');

      db.pet.get(this.petId()!).then((pet) => {
        db.specie.get(pet?.specieId!).then((specie) => {
          if (pet) {
            this.formPet.reset({
              name: pet?.name || '',
              specie: {
                label: specie?.name || '',
                value: String(specie?.id || ''),
              },
              breed: pet?.breed || '',
              photo: pet.photoUrl || '',
              birth: pet?.birthDate.toISOString().split('T')[0] || '',
              gender: {
                label: pet?.gender == 'M' ? 'Macho' : 'Femea',
                value: pet?.gender || '',
              },
            });
          }
        });
      });
    }
  }
}
