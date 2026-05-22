import { Injectable ,inject} from '@angular/core';
import{
  Standing,
  EtablissementStanding
} from '../../types/types';

import {
  calculateStandings,
  getInterEcolesStandings,
  apiSimulate
} from '../../test/mockData';

@Injectable({
  providedIn: 'root',
})
export class Classement {


  constructor() {}

  async getStandings(
    competitionId: string
  ): Promise<Standing[]> {

    const standings = calculateStandings(competitionId);

    return apiSimulate(standings);
  }

  async getInterEcolesStandings(): Promise<EtablissementStanding[]> {

    const standings = getInterEcolesStandings();

    return apiSimulate(standings);
  }
}