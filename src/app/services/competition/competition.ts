import { Injectable ,inject} from '@angular/core';
 import { Loginservice } from '../auth/login/loginservice'; 

import {
  Competition,
  CompetitionStatus,
  CompetitionType,
  SportType
} from '../../types/types';

import {
  getMockCompetitions,
  apiSimulate,
  logAction
} from '../../test/mockData';

@Injectable({
  providedIn: 'root',
})
export class CompetitionService {
  // public deleteCompetition(id:number){
    
  // }
  private authService = inject(Loginservice);

  constructor(
  ) {}

  async getAllCompetitions(): Promise<Competition[]> {

    return apiSimulate(
      getMockCompetitions()
    );
  }

  async getCompetitionById(
    id: string
  ): Promise<Competition | undefined> {

    const competitions = getMockCompetitions();

    return apiSimulate(
      competitions.find(c => c.id === id)
    );
  }

  async createCompetition(
    competition: Omit<Competition, 'id' | 'teamsCount'>
  ): Promise<Competition> {

    const competitions = getMockCompetitions();

    const newComp: Competition = {
      ...competition,
      id: `c-${Date.now()}`,
      teamsCount: 0
    };

    competitions.push(newComp);

    localStorage.setItem(
      'iusj_sports_competitions',
      JSON.stringify(competitions)
    );

    const currentUser =
      this.authService.getCurrentUser();

    if (currentUser) {

      logAction(
        currentUser.id,
        `${currentUser.firstName} ${currentUser.lastName}`,
        'Création Compétition',
        `Création de ${newComp.name} (${newComp.sport})`
      );
    }

    return apiSimulate(newComp);
  }

  async updateCompetition(
    id: string,
    updated: Partial<Competition>
  ): Promise<Competition> {

    const competitions = getMockCompetitions();

    const index = competitions.findIndex(
      c => c.id === id
    );

    if (index === -1) {
      throw new Error('Compétition introuvable');
    }

    competitions[index] = {
      ...competitions[index],
      ...updated
    } as Competition;

    localStorage.setItem(
      'iusj_sports_competitions',
      JSON.stringify(competitions)
    );

    const currentUser =
      this.authService.getCurrentUser();

    if (currentUser) {

      logAction(
        currentUser.id,
        `${currentUser.firstName} ${currentUser.lastName}`,
        'Modification Compétition',
        `Mise à jour de la compétition ${competitions[index].name}`
      );
    }

    return apiSimulate(
      competitions[index]
    );
  }

  async deleteCompetition(
    id: string
  ): Promise<boolean> {

    const competitions = getMockCompetitions();

    const filtered = competitions.filter(
      c => c.id !== id
    );

    localStorage.setItem(
      'iusj_sports_competitions',
      JSON.stringify(filtered)
    );

    const currentUser =
      this.authService.getCurrentUser();

    if (currentUser) {

      logAction(
        currentUser.id,
        `${currentUser.firstName} ${currentUser.lastName}`,
        'Suppression Compétition',
        `Suppression de la compétition ID: ${id}`
      );
    }

    return apiSimulate(true);
  }
}
