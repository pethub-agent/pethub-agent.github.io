import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetSelectComponent } from './pet-select.component';

describe('PetSelectComponent', () => {
  let component: PetSelectComponent;
  let fixture: ComponentFixture<PetSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
