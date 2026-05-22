import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Search , UserCheck ,User} from 'lucide-angular';

import { Player, Team } from '../types';
import { EquipeService } from '../services/equipe.service';
@Component({
  selector: 'app-players',
  imports: [CommonModule , FormsModule],
  templateUrl: './players.html',
  styleUrl: './players.css',
})
export class Players {

  readonly SearchIcon = Search;
  readonly UserCheckIcon = UserCheck;
  readonly UserIcon = User;

  players: Player[] = [];
  teams: Team[] = [];

  search = '';
  sectSelected = 'all';

  async ngOnInit(): Promise<void> {
    const [allPlayers, allTeams] = await Promise.all([
      EquipeService.getAllPlayers(),
      EquipeService.getAllTeams()
    ]);

    this.players = allPlayers;
    this.teams = allTeams;
  }

  getTeamName(teamId: string): string {
    return (
      this.teams.find((t) => t.id === teamId)?.name ||
      'Équipe dissoute'
    );
  }

  getTeamColor(teamId: string): string {
    return (
      this.teams.find((t) => t.id === teamId)?.logoColor ||
      '#64748b'
    );
  }

  get filteredPlayers(): Player[] {
    return this.players.filter((p) => {
      const matchesSearch = `${p.firstName} ${p.lastName} ${p.position}`
        .toLowerCase()
        .includes(this.search.toLowerCase());

      const matchedTeam = this.teams.find(
        (t) => t.id === p.teamId
      );

      const matchesSchool =
        this.sectSelected === 'all' ||
        matchedTeam?.etablissement === this.sectSelected;

      return matchesSearch && matchesSchool;
    });
  }
}