import { inject, Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthApi } from '../../../../core/api/auth/auth.api';
import { db } from '../../../../core/services/database/db';
import { PetGender } from '../../../../core/services/database/tables/pet.table';
import { JwtService } from '../../../../core/services/jwt/jwt.service';
import { StorageKeys } from '../../../../core/services/storage/storage.enum';
import { StorageService } from '../../../../core/services/storage/storage.service';
import { RegisterPetDto } from './dto/register-pet.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { IRegisterPet } from './interfaces/register-pet.interface';

@Injectable({ providedIn: 'root' })
export class RegistrationFacade {
  private auth = inject(AuthApi);
  private storage = inject(StorageService);
  private jwt = inject(JwtService);

  pet$ = new BehaviorSubject<IRegisterPet | null>(null);

  constructor() {
    this.initStore();
  }

  findSpecies() {
    return db.specie.toArray();
  }

  findPets() {
    return db.pet.toArray();
  }

  // Registra pet no store
  registerPet(pet: RegisterPetDto) {
    return db.specie.toArray().then((specieList) => {
      const specie = specieList.find((s) => s.id == pet.specieId);

      this.pet$.next({
        birth: moment(pet.birth).toDate(),
        breed: pet.breed,
        gender: pet.gender,
        name: pet.name,
        photo: pet.photo,
        specie: {
          id: pet.specieId,
          name: specie?.name || '',
        },
      });
    });
  }

  // TODO: Rever segurança do login
  // Registra novo usuario no servidor
  registerUser(user: RegisterUserDto) {
    return this.auth.register(user);
  }

  // Autentica no servidor
  login(email: string, password: string) {
    return this.auth
      .login({
        email,
        password,
      })
      .pipe(
        tap((data) => {
          // Salva o token jwt
          this.storage.set(StorageKeys.token, data.access_token);

          // Recupera token do usuario
          const jwt = this.jwt.decode(data.access_token);
          // Limpa ultimo usuario logado
          db.user.clear();
          // Salva usuario no IndexedDB
          db.user.add({
            email: jwt?.email || '',
            exp: Number(jwt?.exp),
            iat: Number(jwt?.iat),
            name: jwt?.name || '',
            role: jwt?.role || '',
            sub: jwt?.sub || '',
          });
        })
      );
  }

  saveStore() {
    const register = this.pet$.value;

    // Salva Pet no banco local
    return db.pet.add({
      name: register?.name || '',
      breed: register?.breed || '',
      specieId: Number(register?.specie?.id),
      birthDate: register?.birth as Date,
      gender: register?.gender as PetGender,
      photoUrl: register?.photo || '',
    });
  }

  private initStore() {
    db.pet.toArray().then((pets) => {
      if (pets.length) {
        const pet = pets[0];
        return db.specie.toArray().then((species) => {
          // Carrega Pet do IndexedDB
          const specie = species.find((s) => s.id == pet.specieId);
          const data: IRegisterPet = {
            birth: pet.birthDate,
            gender: pet.gender,
            name: pet.name,
            breed: pet.breed || '',
            specie: specie,
            photo: pet.photoUrl || '',
          };

          // Armazena Pet no store
          this.pet$.next(data);
        });
      }
      return;
    });
  }
}
