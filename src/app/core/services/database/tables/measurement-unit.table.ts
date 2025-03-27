export const MEASUREMENT_UNIT_SCHEMA = [
  '++id', // Identificador único
  'unit', // Unidade de medida (ex: "g", "ml", "unidade")
  'description', // Descrição da unidade de medida (ex: "gramas", "mililitros", "unidade")
].toString();

export interface MeasurementUnitTable {
  id?: number; // Identificador único
  unit: string; // Unidade de medida (ex: "g", "ml", "unidade")
  description: string; // Descrição da unidade de medida
}
