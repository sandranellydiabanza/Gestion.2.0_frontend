import { TestBed } from '@angular/core/testing';

import { Matchs } from './matchs';

describe('Matchs', () => {
  let service: Matchs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Matchs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
