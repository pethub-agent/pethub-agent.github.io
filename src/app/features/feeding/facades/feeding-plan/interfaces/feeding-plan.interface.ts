export interface Meal {
  id?: number | null;
  feedingPlanId?: number | null;
  time: string;
  amount: number;
  type: {
    id: number;
    type: string;
    description: string;
  };
  unit: {
    id?: number | null; // Identificador único
    unit: string; // Unidade de medida (ex: "g", "ml", "unidade")
    description: string; // Descrição da unidade de medida
  };
  note: string;
}

export interface FeedingPlan {
  id?: number | null;
  petId?: number | null;
  status?: string;
  note: string;
  meals: Meal[];
  startAt?: Date;
  endAt?: Date | null;
  updateAt?: Date;
}
