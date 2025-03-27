import { AfterViewInit, Component, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { ButtonComponent } from '../../../../core/ui/button/button.component';
import { DateComponent } from '../../../../core/ui/date/date.component';
import { Option } from '../../../../core/ui/select/select.interface';
import { TextareaComponent } from '../../../../core/ui/textarea/textarea.component';
import { FeedingPlanFacade } from '../../facades/feeding-plan/feeding-plan.facade';
import {
  FeedingPlan,
  Meal,
} from '../../facades/feeding-plan/interfaces/feeding-plan.interface';
import { PetStore } from '../../facades/pet/interfaces/pet.interface';
import { PetFacade } from '../../facades/pet/pet.facade';
import { MealsFormComponent } from '../../ui/meals-form/meals-form.component';

@Component({
  selector: 'app-feeding-plan',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DateComponent,
    TextareaComponent,
    MealsFormComponent,
    ButtonComponent,
  ],
  templateUrl: './feeding-plan.component.html',
  styleUrl: './feeding-plan.component.scss',
})
export class FeedingPlanComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private feedingFacade = inject(FeedingPlanFacade);
  private activatedRoute = inject(ActivatedRoute);
  private petFacade = inject(PetFacade);

  plan = signal<FeedingPlan | null>(null);
  petId = signal<number | null>(null);
  pet = signal<PetStore | null>(null);
  error = signal('');

  formPlan = this.fb.group({
    startDate: [moment(new Date()).format('yyyy-MM-DD'), [Validators.required]],
    note: [''],
    meals: this.fb.array([], Validators.required),
  });

  get meals(): FormArray {
    return this.formPlan.get('meals') as FormArray;
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  saveFeedingPlan(event: Event) {
    event.stopPropagation();

    // TODO: validar formulario
    if (this.meals.invalid) {
      this.error.set(
        'Ops! Parece que alguns campos obrigatórios do formulário de refeição não foram preenchidos. Confira os campos destacados e preencha todas as informações antes de continuar.'
      );
      return;
    }

    if (this.formPlan.invalid) {
      this.error.set(
        'Para continuar, preencha todos os campos obrigatórios do plano de alimentação. Verifique os campos destacados e complete as informações necessárias.'
      );
      return;
    }

    const plan = this.formPlan.value;
    const meals = this.formPlan.value.meals as any[];
    this.feedingFacade
      .saveFeedingPlan({
        // Id do plano alimentar caso for edição
        id: this.plan()?.id,
        petId: this.petId(),
        note: plan.note || '',
        startAt: moment(plan.startDate).toDate(),
        meals: meals.map((m) => {
          const meal: Meal = {
            id: m.id,
            feedingPlanId: m.feedingPlanId,
            time: m.time,
            amount: m.amount,
            note: m.note,
            type: {
              id: m.type.value,
              description: m.type.label,
              type: m.type.label,
            },
            unit: {
              id: m.unit.value,
              description: m.unit.label,
              unit: m.unit.label,
            },
          };

          return meal;
        }),
      })
      .then(() => {
        this.goBack();
      });
  }

  goBack() {
    history.back();
  }

  addMeal() {
    const meal = this.fb.control({
      id: null,
      feedingPlanId: null,
      time: '08:00',
      amount: 100,
      note: '',
      type: null,
      unit: null,
    });

    this.meals.push(meal);
  }

  removeMeal(index: number) {
    this.meals.removeAt(index);
  }

  private loadData() {
    const petId = Number(this.activatedRoute.snapshot.params['petId']);
    this.petId.set(Number(petId));

    // Carrega informações do Pet
    this.petFacade.findPet(petId).then((pet) => {
      this.pet.set(pet);
    });

    // Carrega informações do plano de alimentação do Pet
    this.feedingFacade.loadFeedingPlan(petId).then((feedingPlan) => {
      this.plan.set(feedingPlan);
      // Caso não exista é porque é um novo cadastro
      if (!feedingPlan) {
        console.log('TODO: novo');
        this.formPlan.reset({
          startDate: moment(new Date()).format('yyyy-MM-DD'),
          note: '',
          meals: [],
        });
      } else {
        console.log('TODO: editar');
        this.formPlan.reset({
          startDate: moment(feedingPlan.startAt).format('yyyy-MM-DD'),
          note: feedingPlan.note,
          meals: [],
        });

        // Recupera opções do tipo e unidade de medida
        const listMeals = feedingPlan.meals.map((m) => {
          const type: Option = {
            value: String(m.type.id),
            label: m.type.description,
          };
          const unit: Option = {
            value: String(m.unit.id),
            label: m.unit.description,
          };

          m.type = type as any;
          m.unit = unit as any;
          return m;
        });

        // Adiciona MealPlan no formulario de controle
        this.meals.clear();
        listMeals.forEach((m) => {
          const meal = this.fb.control({
            id: m.id,
            feedingPlanId: m.feedingPlanId,
            time: m.time,
            amount: m.amount,
            note: m.note,
            type: m.type,
            unit: m.unit,
          });

          this.meals.push(meal);
        });
      }
    });
  }
}
