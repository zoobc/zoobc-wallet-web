import { TestBed } from '@angular/core/testing';

import { KeyringService } from './keyring.service';

describe('KeyringService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KeyringService = TestBed.get(KeyringService);
    expect(service).toBeTruthy();
  });
});
