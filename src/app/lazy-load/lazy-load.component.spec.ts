import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LazyLoadComponent } from './lazy-load.component';

describe('LazyLoadComponent', () => {
  let component: LazyLoadComponent;
  let fixture: ComponentFixture<LazyLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LazyLoadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LazyLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
