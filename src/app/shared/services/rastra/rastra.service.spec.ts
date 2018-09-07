import { TestBed, inject } from '@angular/core/testing';

import { RastraService } from './rastra.service';

describe('RastraService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RastraService]
    });
  });

  it('should be created', inject([RastraService], (service: RastraService) => {
    expect(service).toBeTruthy();
  }));
});
