import { TestBed, inject } from '@angular/core/testing';

import { HoodieService } from './hoodie.service';

describe('HoodieService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HoodieService]
    });
  });

  it('should be created', inject([HoodieService], (service: HoodieService) => {
    expect(service).toBeTruthy();
  }));
});
