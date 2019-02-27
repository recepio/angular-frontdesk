import { TestBed } from '@angular/core/testing';

import { ThrottledFuncService } from './throttled-func.service';

describe('ThrottledFuncService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThrottledFuncService = TestBed.get(ThrottledFuncService);
    expect(service).toBeTruthy();
  });
});
