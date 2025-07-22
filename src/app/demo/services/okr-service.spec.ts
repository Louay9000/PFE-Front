import { TestBed } from '@angular/core/testing';

import { OkrService } from './okr-service';

describe('OkrService', () => {
  let service: OkrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OkrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
