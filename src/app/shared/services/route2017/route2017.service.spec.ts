import { TestBed, inject } from '@angular/core/testing';

import { Route2017Service } from './route2017.service';

describe('Route2017Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Route2017Service]
    });
  });

  it('should be created', inject([Route2017Service], (service: Route2017Service) => {
    expect(service).toBeTruthy();
  }));
});
