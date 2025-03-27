export const FEEDING_TYPE_SCHEMA = [
  '++id', // Identificador único
  'type', // Tipo de refeição (ex: ração seca, petisco, suplemento)
  'description', // Descrição do tipo de refeição
].toString();

export interface FeedingTypeTable {
  id?: number; // Identificador único
  type: string; // Tipo de refeição (ex: "ração seca", "petisco", "suplemento")
  description: string; // Descrição do tipo de refeição
}
