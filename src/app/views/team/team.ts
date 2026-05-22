import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import{
  Users,
  Plus,
  Pencil,
  Trash2,
  Bookmark,
  Star,
  Search,
  X,
  Loader2,
  UserPlus
} from 'lucide-angular';

import {
  Team,
  Player,
  Etablissement,
  User as LoggedUser
} from '../types';

import { EquipeService } from '../services/equipe.service';


@Component({
  selector: 'app-team',
  imports: [CommonModule,FormsModule],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team {


  @Input() currentUser: LoggedUser | null = null;

  readonly UsersIcon = Users;
  readonly PlusIcon = Plus;
  readonly PencilIcon = Pencil;
  readonly Trash2Icon = Trash2;
  readonly BookmarkIcon = Bookmark;
  readonly StarIcon = Star;
  readonly SearchIcon = Search;
  readonly XIcon = X;
  readonly Loader2Icon = Loader2;
  readonly UserPlusIcon = UserPlus;

  teams: Team[] = [];
  players: Player[] = [];

  loading = true;

  searchTerm = '';
  selectedSchool = 'all';

  activeTeam: Team | null = null;

  isTeamModalOpen = false;
  isPlayerModalOpen = false;

  editTeam: Team | null = null;
  editPlayer: Player | null = null;

  // Team form
  teamName = '';
  school: Etablissement = 'Saint Jean Ingénieur';
  filiere = '';
  logoColor = '#38bdf8';

  // Player form
  pFirstName = '';
  pLastName = '';
  pNumber = 10;
  pPosition = 'Milieu';
  pClass = '';

  schools: Etablissement[] = [
    'Saint Jean Ingénieur',
    'Saint Jean School of Management',
    'Prépa Vogt',
    'CPGE',
    'Prépa Saint Jean Douala'
  ];

  ngOnInit(): void {
    this.loadData();
  }

  get isSportManagementRole(): boolean {
    return (
      this.currentUser?.role === 'Administrateur' ||
      this.currentUser?.role === 'Responsable sportif'
    );
  }

  async loadData(): Promise<void> {

    this.loading = true;

    try {

      const [allTeams, allPlayers] = await Promise.all([
        EquipeService.getAllTeams(),
        EquipeService.getAllPlayers()
      ]);

      this.teams = allTeams;
      this.players = allPlayers;

    } catch (error) {

      alert('Impossible de recharger les équipes');

    } finally {

      this.loading = false;

    }
  }

  get filteredTeams(): Team[] {

    return this.teams.filter((t) => {

      const matchesSearch =
        t.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.filiere.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesSchool =
        this.selectedSchool === 'all' ||
        t.etablissement === this.selectedSchool;

      return matchesSearch && matchesSchool;
    });
  }

  get activeRoster(): Player[] {

    if (!this.activeTeam) return [];

    return this.players.filter(
      (p) => p.teamId === this.activeTeam?.id
    );
  }

  selectTeam(team: Team): void {
    this.activeTeam = team;
  }

  openAddTeamModal(): void {

    this.editTeam = null;

    this.teamName = '';
    this.school = 'Saint Jean Ingénieur';
    this.filiere = 'Génie Logiciel';
    this.logoColor = '#38bdf8';

    this.isTeamModalOpen = true;
  }

  openEditTeamModal(team: Team, event: Event): void {

    event.stopPropagation();

    this.editTeam = team;

    this.teamName = team.name;
    this.school = team.etablissement;
    this.filiere = team.filiere;
    this.logoColor = team.logoColor;

    this.isTeamModalOpen = true;
  }

  async handleSaveTeam(): Promise<void> {

    try {

      if (this.editTeam) {

        await EquipeService.updateTeam(
          this.editTeam.id,
          {
            name: this.teamName,
            etablissement: this.school,
            filiere: this.filiere,
            logoColor: this.logoColor
          }
        );

      } else {

        await EquipeService.createTeam({
          name: this.teamName,
          etablissement: this.school,
          filiere: this.filiere,
          logoColor: this.logoColor
        });

      }

      this.isTeamModalOpen = false;

      await this.loadData();

    } catch (error) {

      alert('Erreur lors de la sauvegarde');

    }
  }

  async handleDeleteTeam(
    id: string,
    event: Event
  ): Promise<void> {

    event.stopPropagation();

    const confirmed = confirm(
      'Supprimer cette équipe ?'
    );

    if (!confirmed) return;

    try {

      await EquipeService.deleteTeam(id);

      if (this.activeTeam?.id === id) {
        this.activeTeam = null;
      }

      await this.loadData();

    } catch (error) {

      alert('Erreur lors de la suppression');

    }
  }

  openAddPlayerModal(): void {

    this.editPlayer = null;

    this.pFirstName = '';
    this.pLastName = '';
    this.pNumber = 10;
    this.pPosition = 'Milieu';
    this.pClass = '';

    this.isPlayerModalOpen = true;
  }

  openEditPlayerModal(player: Player): void {

    this.editPlayer = player;

    this.pFirstName = player.firstName;
    this.pLastName = player.lastName;
    this.pNumber = player.number;
    this.pPosition = player.position;
    this.pClass = player.className;

    this.isPlayerModalOpen = true;
  }

  async handleSavePlayer(): Promise<void> {

    if (!this.activeTeam) return;

    try {

      if (this.editPlayer) {

        await EquipeService.updatePlayer(
          this.editPlayer.id,
          {
            firstName: this.pFirstName,
            lastName: this.pLastName,
            number: this.pNumber,
            position: this.pPosition,
            className: this.pClass
          }
        );

      } else {

        await EquipeService.addPlayer({
          firstName: this.pFirstName,
          lastName: this.pLastName,
          number: this.pNumber,
          position: this.pPosition,
          className: this.pClass,
          teamId: this.activeTeam.id
        });

      }

      this.isPlayerModalOpen = false;

      await this.loadData();

    } catch (error) {

      alert('Erreur lors de la sauvegarde du joueur');

    }
  }

  async handleDeletePlayer(id: string): Promise<void> {

    const confirmed = confirm(
      'Retirer ce joueur ?'
    );

    if (!confirmed) return;

    try {

      await EquipeService.removePlayer(id);

      await this.loadData();

    } catch (error) {

      alert('Erreur lors de la suppression');

    }
  }

  async handleMakeCaptain(player: Player): Promise<void> {

    if (!this.activeTeam) return;

    try {

      await EquipeService.updateTeam(
        this.activeTeam.id,
        {
          captainId: player.id,
          captainName:
            `${player.firstName} ${player.lastName}`
        }
      );

      this.activeTeam = {
        ...this.activeTeam,
        captainId: player.id,
        captainName:
          `${player.firstName} ${player.lastName}`
      };

      await this.loadData();

    } catch (error) {

      alert('Impossible de définir le capitaine');

    }
  }
