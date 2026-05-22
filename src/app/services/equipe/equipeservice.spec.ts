import { TestBed } from '@angular/core/testing';

import { Equipeservice } from './equipeservice';

describe('Equipeservice', () => {
  let service: Equipeservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Equipeservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
