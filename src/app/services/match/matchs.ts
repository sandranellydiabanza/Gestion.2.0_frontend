  import { Injectable ,inject} from '@angular/core';

  import { Match, MatchStatus, CardRecord, GoalRecord, Team } from '../../types/types';
  import { getMockMatches, getMockTeams, apiSimulate, logAction } from '../../test/mockData';
  import {Loginservice } from '../../services/auth/login/loginservice';
  @Injectable({
    providedIn: 'root',
  })
  export class Matchs {
    private static authService = inject(Loginservice);
    static async getAllMatches(): Promise<Match[]> {
      return apiSimulate(getMockMatches());
    }

    static async getMatchesByCompetition(competitionId: string): Promise<Match[]> {
      const matches = getMockMatches();
      return apiSimulate(matches.filter(m => m.competitionId === competitionId));
    }

    static async createMatch(match: Omit<Match, 'id' | 'goals' | 'cards'>): Promise<Match> {
      const matches = getMockMatches();
      const newMatch: Match = {
        ...match,
        id: `m-${Date.now()}`,
        goals: [],
        cards: []
      };

      matches.push(newMatch);
      localStorage.setItem('iusj_sports_matches', JSON.stringify(matches));

      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        logAction(currentUser.id, `${currentUser.firstName} ${currentUser.lastName}`, 'Création Match', `Planification du match: ${newMatch.teamAName} vs ${newMatch.teamBName}`);
      }

      return apiSimulate(newMatch);
    }

    static async updateMatch(id: string, updated: Partial<Match>): Promise<Match> {
      const matches = getMockMatches();
      const index = matches.findIndex(m => m.id === id);
      if (index === -1) throw new Error('Match introuvable');

      matches[index] = { ...matches[index], ...updated } as Match;
      localStorage.setItem('iusj_sports_matches', JSON.stringify(matches));

      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        logAction(currentUser.id, `${currentUser.firstName} ${currentUser.lastName}`, 'Mise à jour Match', `Mise à jour du match ID ${id} (${matches[index].teamAName} vs ${matches[index].teamBName}) - Statut: ${matches[index].status}`);
      }

      return apiSimulate(matches[index]);
    }

    static async deleteMatch(id: string): Promise<boolean> {
      const matches = getMockMatches();
      const filtered = matches.filter(m => m.id !== id);
      localStorage.setItem('iusj_sports_matches', JSON.stringify(filtered));

      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        logAction(currentUser.id, `${currentUser.firstName} ${currentUser.lastName}`, 'Suppression Match', `Suppression du match ID: ${id}`);
      }

      return apiSimulate(true);
    }

    // --- Automatic schedule generator ---
    static async generateAutoSchedule(competitionId: string, competitionName: string, selectedTeams: Team[], startDate: string): Promise<Match[]> {
      if (selectedTeams.length < 2) {
        throw new Error('Il faut au moins 2 équipes pour générer un calendrier.');
      }

      const matches: Match[] = [];
      const pitches = ['Terrain A (Campus Vogt)', 'Stade de l’Ingénieur (Campus SJI)', 'Synthetique de Douala (Campus PSJD)'];
      const referees = ['M. Jean-Paul Mvogo', 'Arbitre Fédéral M. Noah', 'Arbitre Littoral M. Soni', 'M. Stephane Nkou'];

      let currentDate = new Date(startDate);

      // Simple Round-Robin algorithm (all-play-all)
      for (let i = 0; i < selectedTeams.length; i++) {
        for (let j = i + 1; j < selectedTeams.length; j++) {
          const teamA = selectedTeams[i];
          const teamB = selectedTeams[j];

          // Format dates cleanly YYYY-MM-DD
          const dateString = currentDate.toISOString().split('T')[0];
          const pitch = pitches[Math.floor(Math.random() * pitches.length)];
          const referee = referees[Math.floor(Math.random() * referees.length)];

          const newMatch: Match = {
            id: `m-generated-${Date.now()}-${i}-${j}`,
            competitionId,
            competitionName,
            teamAId: teamA.id,
            teamAName: teamA.name,
            teamALogoColor: teamA.logoColor,
            teamBId: teamB.id,
            teamBName: teamB.name,
            teamBLogoColor: teamB.logoColor,
            date: dateString,
            time: `${14 + Math.floor(Math.random() * 3)}:30`, // 14:30, 15:30, 16:30
            pitch,
            referee,
            status: 'Planifié',
            goals: [],
            cards: []
          };

          matches.push(newMatch);

          // Add 2 or 3 days to schedule next match to prevent clashes
          currentDate.setDate(currentDate.getDate() + 3);
        }
      }

      // Merge generated matches into current list
      const existingMatches = getMockMatches();
      const updatedMatches = [...existingMatches, ...matches];
      localStorage.setItem('iusj_sports_matches', JSON.stringify(updatedMatches));

      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        logAction(currentUser.id, `${currentUser.firstName} ${currentUser.lastName}`, 'Calendrier Auto', `Génération automatique de ${matches.length} matchs pour la compétition ${competitionName}`);
      }

      return apiSimulate(matches);
    }

    // --- Statistics and events logged on an live match ---
    static async addGoal(matchId: string, item: Omit<GoalRecord, 'id'>): Promise<Match> {
      const matches = getMockMatches();
      const index = matches.findIndex(m => m.id === matchId);
      if (index === -1) throw new Error('Match introuvable');

      const newGoal: GoalRecord = {
        ...item,
        id: `goal-${Date.now()}`
      };

      const match = matches[index];
      match.goals.push(newGoal);

      // Increment current scoreboard dynamically
      if (match.teamAId === item.teamId) {
        match.scoreA = (match.scoreA || 0) + 1;
      } else {
        match.scoreB = (match.scoreB || 0) + 1;
      }

      localStorage.setItem('iusj_sports_matches', JSON.stringify(matches));
      return apiSimulate(match);
    }

    static async addCard(matchId: string, item: Omit<CardRecord, 'id'>): Promise<Match> {
      const matches = getMockMatches();
      const index = matches.findIndex(m => m.id === matchId);
      if (index === -1) throw new Error('Match introuvable');

      const newCard: CardRecord = {
        ...item,
        id: `card-${Date.now()}`
      };

      const match = matches[index];
      match.cards.push(newCard);

      localStorage.setItem('iusj_sports_matches', JSON.stringify(matches));
      return apiSimulate(match);
    }
  }
