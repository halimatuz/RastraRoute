import { TestBed, inject } from '@angular/core/testing';

import { GudangService } from './gudang.service';

describe('GudangService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GudangService]
    });
  });

  it('should be created', inject([GudangService], (service: GudangService) => {
    expect(service).toBeTruthy();
  }));
});
