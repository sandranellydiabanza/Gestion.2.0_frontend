import { TestBed } from '@angular/core/testing';

import { Matchservice } from './matchservice';

describe('Matchservice', () => {
  let service: Matchservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Matchservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
