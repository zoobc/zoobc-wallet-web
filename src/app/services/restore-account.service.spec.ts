import { TestBed } from '@angular/core/testing';

import { RestoreAccountService } from './restore-account.service';

describe('RestoreAccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RestoreAccountService = TestBed.get(RestoreAccountService);
    expect(service).toBeTruthy();
  });
});
