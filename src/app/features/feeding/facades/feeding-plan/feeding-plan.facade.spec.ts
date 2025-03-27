import { TestBed } from '@angular/core/testing';

import { FeedingPlanFacade } from './feeding-plan.facade';

describe('FeedingService', () => {
  let service: FeedingPlanFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedingPlanFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
