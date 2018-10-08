import { TestBed, inject } from '@angular/core/testing';

import { Genalgov2Service } from './genalgov2.service';

describe('Genalgov2Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Genalgov2Service]
    });
  });

  it('should be created', inject([Genalgov2Service], (service: Genalgov2Service) => {
    expect(service).toBeTruthy();
  }));
});
