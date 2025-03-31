import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyGoalCardComponent } from './weekly-goal-card.component';

describe('WeeklyGoalCardComponent', () => {
  let component: WeeklyGoalCardComponent;
  let fixture: ComponentFixture<WeeklyGoalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyGoalCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyGoalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
