import { TestBed } from '@angular/core/testing';

import { PoownService } from './poown.service';

describe('PoownService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PoownService = TestBed.get(PoownService);
    expect(service).toBeTruthy();
  });
});
