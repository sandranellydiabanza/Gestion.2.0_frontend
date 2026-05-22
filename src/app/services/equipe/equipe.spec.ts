import { TestBed } from '@angular/core/testing';

import { Equipe } from './equipe';

describe('Equipe', () => {
  let service: Equipe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Equipe);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
