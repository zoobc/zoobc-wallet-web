import { TestBed } from '@angular/core/testing';

import { NodeAdminService } from './node-admin.service';

describe('NodeAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodeAdminService = TestBed.get(NodeAdminService);
    expect(service).toBeTruthy();
  });
});
