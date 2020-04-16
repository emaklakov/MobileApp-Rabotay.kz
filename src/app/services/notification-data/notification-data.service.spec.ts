import { TestBed } from '@angular/core/testing';

import { NotificationDataService } from './notification-data.service';

describe('NotificationDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationDataService = TestBed.get(NotificationDataService);
    expect(service).toBeTruthy();
  });
});
