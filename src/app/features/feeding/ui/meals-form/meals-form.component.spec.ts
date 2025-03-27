import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealsFormComponent } from './meals-form.component';

describe('MealsFormComponent', () => {
  let component: MealsFormComponent;
  let fixture: ComponentFixture<MealsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
