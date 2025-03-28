import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMealRecordComponent } from './modal-meal-record.component';

describe('ModalMealRecordComponent', () => {
  let component: ModalMealRecordComponent;
  let fixture: ComponentFixture<ModalMealRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalMealRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMealRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
