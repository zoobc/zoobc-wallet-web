import { TestBed } from '@angular/core/testing';

import { NodeRegistrationService } from './node-registration.service';

describe('NodeRegistrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodeRegistrationService = TestBed.get(NodeRegistrationService);
    expect(service).toBeTruthy();
  });
});
