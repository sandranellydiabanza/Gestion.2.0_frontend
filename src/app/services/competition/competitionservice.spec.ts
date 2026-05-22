import { TestBed } from '@angular/core/testing';

import { Competitionservice } from './competitionservice';

describe('Competitionservice', () => {
  let service: Competitionservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Competitionservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
