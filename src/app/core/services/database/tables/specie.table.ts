export const SPECIE_SCHEMA = ['++id', 'name'].toString();

export interface SpecieTable {
  id?: number; // Unique identifier for the species
  name: string; // Name of the species (e.g., dog, cat, other)
}
