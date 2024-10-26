import { TestBed } from '@angular/core/testing';

import { DPMlistingService } from './dpmlisting.service';

describe('DPMlistingService', () => {
  let service: DPMlistingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DPMlistingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
