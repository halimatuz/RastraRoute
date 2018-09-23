import { TestBed, inject } from '@angular/core/testing';

import { GenalgoService } from './genalgo.service';

describe('GenalgoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenalgoService]
    });
  });

  it('should be created', inject([GenalgoService], (service: GenalgoService) => {
    expect(service).toBeTruthy();
  }));
});
