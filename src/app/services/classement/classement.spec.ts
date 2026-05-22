import { TestBed } from '@angular/core/testing';

import { Classement } from './classement';

describe('Classement', () => {
  let service: Classement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Classement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
