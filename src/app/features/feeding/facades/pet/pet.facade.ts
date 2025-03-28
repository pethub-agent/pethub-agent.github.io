import { inject, Injectable } from '@angular/core';
import { db } from '../../../../core/services/database/db';
import { PetTable } from '../../../../core/services/database/tables/pet.table';
import { JwtService } from '../../../../core/services/jwt/jwt.service';
import { AddPetDto } from '../../pages/pet-form/dto/add-pet.dto';
import { PetView } from './view/pet.view';

@Injectable({
  providedIn: 'root',
})
export class PetFacade {
  private jwt = inject(JwtService);

  async listPets() {
    const pets = await db.pet.toArray();
    const mappedPets = await this.mapPets(pets);
    return mappedPets;
  }

  async listSpecies() {
    const species = await db.specie.toArray();
    return species;
  }

  async findPet(petId: number) {
    const pet = await db.pet.get(petId);
    if (!pet) {
      throw new Error('Pet não encontrado: ' + petId);
    }

    const specie = await db.specie.get(pet?.specieId);

    return {
      ...pet,
      specie: {
        label: specie?.name || '',
        value: String(specie?.id || ''),
      },
      gender: {
        label: pet?.gender == 'M' ? 'Macho' : 'Femea',
        value: pet?.gender || '',
      },
    } as PetView;
  }

  async updatePet(pet: AddPetDto) {
    const token = this.jwt.decode();
    const petId = await db.pet.update(pet.id, {
      birthDate: pet.birth,
      gender: pet.gender,
      name: pet.name || '',
      specieId: Number(pet.specieId),
      breed: pet.breed || '',
      ownerId: token?.sub || '',
      photoUrl: pet.photo || '',
    } as Partial<PetTable>);

    return petId;
  }

  async addPet(pet: AddPetDto) {
    const token = this.jwt.decode();
    const petId = await db.pet.add({
      birthDate: pet.birth,
      gender: pet.gender,
      name: pet.name || '',
      specieId: Number(pet.specieId),
      breed: pet.breed || '',
      ownerId: token?.sub || '',
      photoUrl: pet.photo || '',
    });

    return petId;
  }

  private async mapPets(pets: PetTable[]): Promise<PetView[]> {
    return Promise.all(
      pets.map(async (p) => {
        const specie = await db.specie.get(p.specieId);
        if (!specie) {
          throw new Error('Espécie não encontrada: ' + p.specieId);
        }

        return {
          id: p.id,
          name: p.name,
          breed: p.breed,
          specie: {
            value: specie.id,
            label: specie.name,
          },
          specieId: specie.id,
          ownerId: p.ownerId,
          birthDate: p.birthDate,
          gender: {
            value: p.gender,
            label: p.gender == 'M' ? 'Macho' : 'Femea',
          },
          photoUrl: p.photoUrl,
        } as PetView;
      })
    );
  }
}
