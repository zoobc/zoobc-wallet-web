import { TestBed } from '@angular/core/testing';

import { GrpcapiService } from './grpcapi.service';

describe('GrpcapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GrpcapiService = TestBed.get(GrpcapiService);
    expect(service).toBeTruthy();
  });
});
