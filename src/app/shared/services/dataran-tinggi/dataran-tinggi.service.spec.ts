import { TestBed, inject } from '@angular/core/testing';

import { DataranTinggiService } from './dataran-tinggi.service';

describe('DataranTinggiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataranTinggiService]
    });
  });

  it('should be created', inject([DataranTinggiService], (service: DataranTinggiService) => {
    expect(service).toBeTruthy();
  }));
});
