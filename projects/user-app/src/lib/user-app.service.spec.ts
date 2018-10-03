import { TestBed, inject } from '@angular/core/testing';

import { UserAppService } from './user-app.service';

describe('UserAppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAppService]
    });
  });

  it('should be created', inject([UserAppService], (service: UserAppService) => {
    expect(service).toBeTruthy();
  }));
});
