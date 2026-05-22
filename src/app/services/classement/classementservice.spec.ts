import { TestBed } from '@angular/core/testing';

import { Classementservice } from './classementservice';

describe('Classementservice', () => {
  let service: Classementservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Classementservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
