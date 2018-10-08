import { TestBed, inject } from '@angular/core/testing';

import { DummyRouteService } from './dummy-route.service';

describe('DummyRouteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DummyRouteService]
    });
  });

  it('should be created', inject([DummyRouteService], (service: DummyRouteService) => {
    expect(service).toBeTruthy();
  }));
});
