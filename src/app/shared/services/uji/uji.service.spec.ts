import { TestBed, inject } from '@angular/core/testing';

import { UjiService } from './uji.service';

describe('UjiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UjiService]
    });
  });

  it('should be created', inject([UjiService], (service: UjiService) => {
    expect(service).toBeTruthy();
  }));
});
