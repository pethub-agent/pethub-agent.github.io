import { inject, Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { AuthApi } from '../../../../core/api/auth/auth.api';
import { SpecieEntity } from '../../../../core/services/database/entity/specie/specie.entity';
import { RegisterPetDto } from './dto/register-pet.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { IRegisterUser } from './interfaces/register-user.interface';

@Injectable({ providedIn: 'root' })
export class RegistrationFacade {
  private species = inject(SpecieEntity);
  private auth = inject(AuthApi);

  store = new BehaviorSubject<IRegisterUser>({
    name: '',
    email: '',
    password: '',
    confirmation: '',
    pet: null,
  });

  listSpecies() {
    return this.species.getAll();
  }

  // TODO: Registrar pet no IndexedDB
  registerPet(data: RegisterPetDto) {
    const current = this.store.value;

    return this.species.getAll().then((specieList) => {
      const specie = specieList.find((s) => s.id == data.specieId);
      current.pet = {
        birth: moment(data.birth).toDate(),
        breed: data.breed,
        gender: data.birth,
        name: data.name,
        // TODO: Add photoUrl
        photoUrl: '',
        specie: {
          id: data.specieId,
          name: specie?.name || '',
        },
      };
      this.store.next(current);
      return;
    });
  }

  registerUser(user: RegisterUserDto) {
    return this.auth.register(user);
  }

  login(email: string, password: string) {
    return this.auth.login({
      email,
      password,
    });
  }
}
