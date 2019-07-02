import { TestBed } from '@angular/core/testing';

import { CurrencyRateService } from './currency-rate.service';

describe('CurrencyRateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrencyRateService = TestBed.get(CurrencyRateService);
    expect(service).toBeTruthy();
  });
});
