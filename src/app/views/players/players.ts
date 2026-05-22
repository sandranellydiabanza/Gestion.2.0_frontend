import { CommonModule } from '@angular/common';
import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Search , UserCheck ,User, LucideAngularModule} from 'lucide-angular';

import { Player, Team } from '../../types/types';
import { Equipeservice } from '../../services/equipe/equipeservice';
@Component({
  selector: 'app-players',
  imports: [CommonModule , FormsModule,LucideAngularModule],
  templateUrl: './players.html',
  styleUrl: './players.css',
})
export class Players {

  readonly SearchIcon = Search;
  readonly UserCheckIcon = UserCheck;
  readonly UserIcon = User;
private Equipeservice = inject(Equipeservice);

  players: Player[] = [];
  teams: Team[] = [];

  search = '';
  sectSelected = 'all';

  async ngOnInit(): Promise<void> {
    const [allPlayers, allTeams] = await Promise.all([
     this.Equipeservice.getAllPlayers(),
      this.Equipeservice.getAllTeams()
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