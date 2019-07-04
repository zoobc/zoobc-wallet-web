import { TestBed } from '@angular/core/testing';

import { MnemonicsService } from './mnemonics.service';

describe('MnemonicsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MnemonicsService = TestBed.get(MnemonicsService);
    expect(service).toBeTruthy();
  });
});
