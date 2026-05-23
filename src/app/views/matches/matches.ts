import { CommonModule } from '@angular/common';
import { Component ,inject, Input, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Calendar,
  Plus,
  Tv,
  Users,
  Award,
  Clock,
  MapPin,
  Smile,
  ChevronDown,
  X,
  UserCheck,
  Loader2,
  
  RefreshCw,
  LucideAngularModule
} from 'lucide-angular';
import { Competition, Match, MatchStatus, Team,Player } from '../../types/types';
import { Classementservice } from '../../services/classement/classementservice';
import { Equipeservice } from '../../services/equipe/equipeservice';
import { Matchservice } from '../../services/match/matchservice';
import { Competitionservice } from '../../services/competition/competitionservice';
import { Notificationservice } from '../../services/notification/notificationservice';


@Component({
  selector: 'app-matches',
  imports: [LucideAngularModule,CommonModule ,FormsModule],
  templateUrl: './matches.html',
  styleUrl: './matches.css',
})
export class Matches implements OnInit {

private MatchService = inject(Matchservice);
private EquipeService = inject(Equipeservice);
private ClassementService = inject(Classementservice);
private notificationService = inject(Notificationservice);
private competitionService = inject(Competitionservice);
  @Input() currentUser: any;

  @Input() showToast!: (
    msg: string,
    type: 'success' | 'error'
  ) => void;

  matches: Match[] = [];
  competitions: Competition[] = [];
  teams: Team[] = [];

  loading = true;

  selectedCompFilter = 'all';
  selectedStatusFilter = 'all';

  expandedMatchId: string | null = null;

  isScoreModalOpen = false;
  isScheduleModalOpen = false;
  isAutoGeneratorOpen = false;

  selectedMatch: Match | null = null;

  scoreA = 0;
  scoreB = 0;
  matchStatus: MatchStatus = 'Planifié';

  selectedScorerId = '';
  selectedScorerTeamId = '';
  goalMinute = 45;

  selectedCardPlayerId = '';
  selectedCardTeamId = '';

  cardType: 'yellow' | 'red' = 'yellow';
  cardMinute = 45;

  matchDate = '';
  matchTime = '';
  matchPitch = '';
  matchReferee = '';
  reportReason = '';

  tempStatus: MatchStatus = 'Planifié';

  genCompetitionId = '';
  genStartDate = '';

  genSelectedTeamIds: string[] = [];

  activeScorersList: Player[] = [];

  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly ChevronDown = ChevronDown;
  readonly Loader2 = Loader2;
  readonly Tv = Tv;
  readonly X = X;
  readonly RefreshCw = RefreshCw;

  constructor(
  
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  get isSportManagementRole(): boolean {
    return (
      this.currentUser?.role === 'Administrateur' ||
      this.currentUser?.role === 'Responsable sportif'
    );
  }

  get filteredMatches(): Match[] {
    return this.matches.filter((m) => {
      const matchesComp =
        this.selectedCompFilter === 'all' ||
        m.competitionId === this.selectedCompFilter;

      const matchesStatus =
        this.selectedStatusFilter === 'all' ||
        m.status === this.selectedStatusFilter;

      return matchesComp && matchesStatus;
    });
  }

  async loadData(): Promise<void> {
    this.loading = true;

    try {
      const [allMatches, allCompetitions, allTeams] =
        await Promise.all([
          this.MatchService.getAllMatches(),
          this.competitionService.getAllCompetitions(),
          this.EquipeService.getAllTeams()
        ]);

      this.matches = allMatches;
      this.competitions = allCompetitions;
      this.teams = allTeams;

      if (allCompetitions.length > 0) {
        this.genCompetitionId = allCompetitions[0].id;
      }

    } catch (error) {
      this.showToast(
        'Erreur lors de la récupération des rencontres',
        'error'
      );
    } finally {
      this.loading = false;
    }
  }

  async loadPlayers(match: Match): Promise<void> {
    const playersA = await this.EquipeService.getPlayersByTeam(match.teamAId);
    const playersB = await this.EquipeService.getPlayersByTeam(match.teamBId);

    this.activeScorersList = [...playersA, ...playersB];

    if (playersA.length > 0) {
      this.selectedScorerId = playersA[0].id;
      this.selectedScorerTeamId = match.teamAId;

      this.selectedCardPlayerId = playersA[0].id;
      this.selectedCardTeamId = match.teamAId;
    }
  }

  async handleOpenScoreModal(match: Match): Promise<void> {
    this.selectedMatch = match;

    this.scoreA = match.scoreA || 0;
    this.scoreB = match.scoreB || 0;

    this.matchStatus = match.status;

    await this.loadPlayers(match);

    this.isScoreModalOpen = true;
  }

  async handleSaveScore(): Promise<void> {

    if (!this.selectedMatch) return;

    try {

      await this.MatchService.updateMatch(
        this.selectedMatch.id,
        {
          scoreA: Number(this.scoreA),
          scoreB: Number(this.scoreB),
          status: this.matchStatus
        }
      );

      if (
        this.matchStatus === 'Terminé' &&
        this.selectedMatch.status !== 'Terminé'
      ) {

        await this.notificationService.createNotification({
          title: `Résultat final : ${this.selectedMatch.teamAName} ${this.scoreA} - ${this.scoreB} ${this.selectedMatch.teamBName}`,
          content: `Le match s’est achevé sur un score de ${this.scoreA}-${this.scoreB}.`,
          type: 'result'
        });
      }

      this.showToast(
        'Résultats enregistrés avec succès',
        'success'
      );

      this.isScoreModalOpen = false;

      this.loadData();

    } catch (error) {
      this.showToast(
        'Erreur lors de l’enregistrement du score',
        'error'
      );
    }
  }

  async handleAddGoalDirectly(): Promise<void> {

    if (!this.selectedMatch || !this.selectedScorerId) return;

    const scorer = this.activeScorersList.find(
      p => p.id === this.selectedScorerId
    );

    if (!scorer) return;

    try {

      await this.MatchService.addGoal(
        this.selectedMatch.id,
        {
          scorerId: scorer.id,
          scorerName: `${scorer.firstName} ${scorer.lastName}`,
          teamId: this.selectedScorerTeamId,
          minute: this.goalMinute
        }
      );

      if (this.selectedScorerTeamId === this.selectedMatch.teamAId) {
        this.scoreA++;
      } else {
        this.scoreB++;
      }

      this.showToast(
        `But ajouté à la ${this.goalMinute}'`,
        'success'
      );

      this.loadData();

    } catch (error) {
      this.showToast(
        'Erreur lors de l’ajout du but',
        'error'
      );
    }
  }

  async handleAddCardDirectly(): Promise<void> {

    if (!this.selectedMatch || !this.selectedCardPlayerId) return;

    const player = this.activeScorersList.find(
      p => p.id === this.selectedCardPlayerId
    );

    if (!player) return;

    try {

      await this.MatchService.addCard(
        this.selectedMatch.id,
        {
          playerId: player.id,
          playerName: `${player.firstName} ${player.lastName}`,
          teamId: this.selectedCardTeamId,
          type: this.cardType,
          minute: this.cardMinute
        }
      );

      this.showToast(
        'Carton enregistré',
        'success'
      );

      this.loadData();

    } catch (error) {
      this.showToast(
        'Erreur lors du log du carton',
        'error'
      );
    }
  }

  handleOpenScheduleModal(match: Match): void {

    this.selectedMatch = match;

    this.matchDate = match.date;
    this.matchTime = match.time;
    this.matchPitch = match.pitch;
    this.matchReferee = match.referee;

    this.reportReason = match.reportReason || '';

    this.tempStatus = match.status;

    this.isScheduleModalOpen = true;
  }

  async handleSaveSchedule(): Promise<void> {

    if (!this.selectedMatch) return;

    try {

      await this.MatchService.updateMatch(
        this.selectedMatch.id,
        {
          date: this.matchDate,
          time: this.matchTime,
          pitch: this.matchPitch,
          referee: this.matchReferee,
          status: this.tempStatus,
          reportReason:
            this.tempStatus === 'Reporté'
              ? this.reportReason
              : undefined
        }
      );

      this.showToast(
        'Planification modifiée',
        'success'
      );

      this.isScheduleModalOpen = false;

      this.loadData();

    } catch (error) {

      this.showToast(
        'Erreur lors de la planification',
        'error'
      );
    }
  }

  handleOpenAutoGenerator(): void {
    this.genStartDate = '2026-06-01';
    this.genSelectedTeamIds = [];
    this.isAutoGeneratorOpen = true;
  }

  handleAddTeamToGenList(teamId: string): void {

    if (this.genSelectedTeamIds.includes(teamId)) {

      this.genSelectedTeamIds =
        this.genSelectedTeamIds.filter(id => id !== teamId);

    } else {

      this.genSelectedTeamIds.push(teamId);
    }
  }

  async handleGenerateAutoCalendar(): Promise<void> {

    const comp = this.competitions.find(
      c => c.id === this.genCompetitionId
    );

    if (!comp) return;

    const participatingTeams =
      this.teams.filter(t =>
        this.genSelectedTeamIds.includes(t.id)
      );

    if (participatingTeams.length < 2) {

      this.showToast(
        'Veuillez sélectionner au moins 2 équipes',
        'error'
      );

      return;
    }

    try {

      await this.MatchService.generateAutoSchedule(
        this.genCompetitionId,
        comp.name,
        participatingTeams,
        this.genStartDate
      );

      this.showToast(
        'Calendrier généré avec succès',
        'success'
      );

      this.isAutoGeneratorOpen = false;

      this.loadData();

    } catch (error) {

      this.showToast(
        'Erreur lors de la génération',
        'error'
      );
    }
  }

  toggleEvents(matchId: string): void {

    this.expandedMatchId =
      this.expandedMatchId === matchId
        ? null
        : matchId;
  }
}