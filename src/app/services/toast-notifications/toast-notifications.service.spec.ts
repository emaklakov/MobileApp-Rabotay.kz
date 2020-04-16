import { TestBed } from '@angular/core/testing';

import { ToastNotificationsService } from './toast-notifications.service';

describe('ToastNotificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToastNotificationsService = TestBed.get(ToastNotificationsService);
    expect(service).toBeTruthy();
  });
});
