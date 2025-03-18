export interface IRegisterPet {
  name: string;
  breed: string;
  gender: 'M' | 'F' | string;
  birth: Date;
  photoUrl: string;
  specie: {
    id: number | string;
    name: string;
  };
}
