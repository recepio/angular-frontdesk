import { TestBed } from '@angular/core/testing';

import { WorkSpaceDescriptionService } from './work-space-description.service';

describe('WorkSpaceDescriptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkSpaceDescriptionService = TestBed.get(WorkSpaceDescriptionService);
    expect(service).toBeTruthy();
  });
});
