import { Injectable ,inject} from '@angular/core';

import { Team, Player } from '../../types/types';
import {
  getMockTeams,
  getMockPlayers,
  apiSimulate,
  logAction
} from '../../test/mockData';
import {Loginservice } from '../../services/auth/login/loginservice';

@Injectable({
  providedIn: 'root',
})
export class Equipeservice {
constructor(
    public authService: Loginservice
  ) {}


  // =========================
  // ======= TEAMS ===========
  // =========================

  async getAllTeams(): Promise<Team[]> {
    return apiSimulate(getMockTeams());
  }

  async getTeamById(id: string): Promise<Team | undefined> {
    const teams = getMockTeams();

    return apiSimulate(
      teams.find(team => team.id === id)
    );
  }

  async createTeam(
    team: Omit<Team, 'id' | 'playersCount'>
  ): Promise<Team> {

    const teams = getMockTeams();

    const newTeam: Team = {
      ...team,
      id: `t-${Date.now()}`,
      playersCount: 0
    };

    teams.push(newTeam);

    localStorage.setItem(
      'iusj_sports_teams',
      JSON.stringify(teams)
    );

    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      logAction(
        currentUser.id,
        `${currentUser.firstName} ${currentUser.lastName}`,
        'Création Équipe',
        `Création de l'équipe ${newTeam.name} (${newTeam.etablissement})`
      );
    }

    return apiSimulate(newTeam);
  }

  async updateTeam(
    id: string,
    updated: Partial<Team>
  ): Promise<Team> {

    const teams = getMockTeams();

    const index = teams.findIndex(
      team => team.id === id
    );

    if (index === -1) {
      throw new Error('Équipe introuvable');
    }

    teams[index] = {
      ...teams[index],
      ...updated
    };

    localStorage.setItem(
      'iusj_sports_teams',
      JSON.stringify(teams)
    );

    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      logAction(
        currentUser.id,
        `${currentUser.firstName} ${currentUser.lastName}`,
        'Modification Équipe',
        `Mise à jour de l'équipe ${teams[index].name}`
      );
    }

    return apiSimulate(teams[index]);
  }

  async deleteTeam(id: string): Promise<boolean> {

    const teams = getMockTeams();

    const filteredTeams = teams.filter(
      team => team.id !== id
    );

    localStorage.setItem(
      'iusj_sports_teams',
      JSON.stringify(filteredTeams)
    );

    // Suppression des joueurs liés à l'équipe
    const players = getMockPlayers();

    const updatedPlayers = players.filter(
      player => player.teamId !== id
    );

    localStorage.setItem(
      'iusj_sports_players',
      JSON.stringify(updatedPlayers)
    );

    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      logAction(
        currentUser.id,
        `${currentUser.firstName} ${currentUser.lastName}`,
        'Suppression Équipe',
        `Suppression de l'équipe ID: ${id}`
      );
    }

    return apiSimulate(true);
  }

  // =========================
  // ======= PLAYERS =========
  // =========================

  async getAllPlayers(): Promise<Player[]> {
    return apiSimulate(getMockPlayers());
  }

  async getPlayersByTeam(
    teamId: string
  ): Promise<Player[]> {

    const players = getMockPlayers();

    return apiSimulate(
      players.filter(player => player.teamId === teamId)
    );
  }

  async addPlayer(
    player: Omit<Player, 'id'>
  ): Promise<Player> {

    const players = getMockPlayers();

    const newPlayer: Player = {
      ...player,
      id: `p-${Date.now()}`
    };

    players.push(newPlayer);

    localStorage.setItem(
      'iusj_sports_players',
      JSON.stringify(players)
    );

    // Mise à jour du nombre de joueurs
    const teams = getMockTeams();

    const teamIndex = teams.findIndex(
      team => team.id === player.teamId
    );

    if (teamIndex !== -1) {

      teams[teamIndex].playersCount += 1;

      localStorage.setItem(
        'iusj_sports_teams',
        JSON.stringify(teams)
      );
    }

    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      logAction(
        currentUser.id,
        `${currentUser.firstName} ${currentUser.lastName}`,
        'Ajout Joueur',
        `Ajout de ${newPlayer.firstName} ${newPlayer.lastName} à l'équipe ID ${player.teamId}`
      );
    }

    return apiSimulate(newPlayer);
  }

  async updatePlayer(
    id: string,
    updated: Partial<Player>
  ): Promise<Player> {

    const players = getMockPlayers();

    const index = players.findIndex(
      player => player.id === id
    );

    if (index === -1) {
      throw new Error('Joueur introuvable');
    }

    const oldTeamId = players[index].teamId;

    players[index] = {
      ...players[index],
      ...updated
    };

    localStorage.setItem(
      'iusj_sports_players',
      JSON.stringify(players)
    );

    // Si l'équipe change
    if (
      updated.teamId &&
      updated.teamId !== oldTeamId
    ) {

      const teams = getMockTeams();

      // Ancienne équipe
      const oldTeamIndex = teams.findIndex(
        team => team.id === oldTeamId
      );

      if (oldTeamIndex !== -1) {
        teams[oldTeamIndex].playersCount = Math.max(
          0,
          teams[oldTeamIndex].playersCount - 1
        );
      }

      // Nouvelle équipe
      const newTeamIndex = teams.findIndex(
        team => team.id === updated.teamId
      );

      if (newTeamIndex !== -1) {
        teams[newTeamIndex].playersCount += 1;
      }

      localStorage.setItem(
        'iusj_sports_teams',
        JSON.stringify(teams)
      );
    }

    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      logAction(
        currentUser.id,
        `${currentUser.firstName} ${currentUser.lastName}`,
        'Modification Joueur',
        `Mise à jour du joueur ${players[index].firstName} ${players[index].lastName}`
      );
    }

    return apiSimulate(players[index]);
  }

  async removePlayer(id: string): Promise<boolean> {

    const players = getMockPlayers();

    const player = players.find(
      p => p.id === id
    );

    if (!player) {
      return apiSimulate(false);
    }

    const filteredPlayers = players.filter(
      p => p.id !== id
    );

    localStorage.setItem(
      'iusj_sports_players',
      JSON.stringify(filteredPlayers)
    );

    // Mise à jour du nombre de joueurs
    const teams = getMockTeams();

    const teamIndex = teams.findIndex(
      team => team.id === player.teamId
    );

    if (teamIndex !== -1) {

      teams[teamIndex].playersCount = Math.max(
        0,
        teams[teamIndex].playersCount - 1
      );

      // Suppression du capitaine si besoin
      if (teams[teamIndex].captainId === id) {

        teams[teamIndex].captainId = undefined;
        teams[teamIndex].captainName = undefined;
      }

      localStorage.setItem(
        'iusj_sports_teams',
        JSON.stringify(teams)
      );
    }

    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      logAction(
        currentUser.id,
        `${currentUser.firstName} ${currentUser.lastName}`,
        'Suppression Joueur',
        `Suppression du joueur ${player.firstName} ${player.lastName}`
      );
    }

    return apiSimulate(true);
  }
}
