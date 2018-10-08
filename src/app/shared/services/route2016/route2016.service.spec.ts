import { TestBed, inject } from '@angular/core/testing';

import { Route2016Service } from './route2016.service';

describe('Route2016Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Route2016Service]
    });
  });

  it('should be created', inject([Route2016Service], (service: Route2016Service) => {
    expect(service).toBeTruthy();
  }));
});
