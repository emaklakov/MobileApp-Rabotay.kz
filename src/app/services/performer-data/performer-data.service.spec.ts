import { TestBed } from '@angular/core/testing';

import { PerformerDataService } from './performer-data.service';

describe('PerformerDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PerformerDataService = TestBed.get(PerformerDataService);
    expect(service).toBeTruthy();
  });
});
