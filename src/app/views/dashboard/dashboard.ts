import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Activity,
  Trophy,
  Users,
  Calendar,
  ChevronRight,
  TrendingUp,
  Award,
  Clock,
  MapPin,
  RefreshCw,
  Sparkles
} from 'lucide-angular';



@Component({
  selector: 'app-dashboard',
  imports: [CommonModule , FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {


  @Input() onNavigate!: (route: string) => void;
  @Input() showToast!: (msg: string, type: 'success' | 'error') => void;

  readonly Activity = Activity;
  readonly Trophy = Trophy;
  readonly Users = Users;
  readonly Calendar = Calendar;
  readonly ChevronRight = ChevronRight;
  readonly TrendingUp = TrendingUp;
  readonly Award = Award;
  readonly Clock = Clock;
  readonly MapPin = MapPin;
  readonly RefreshCw = RefreshCw;
  readonly Sparkles = Sparkles;

  teams: Team[] = [];
  matches: Match[] = [];
  competitions: Competition[] = [];
  schoolStandings: EtablissementStanding[] = [];

  loading = true;

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {

    this.loading = true;

    try {

      const [
        allTeams,
        allMatches,
        allCompetitions,
        standings
      ] = await Promise.all([
        EquipeService.getAllTeams(),
        MatchService.getAllMatches(),
        CompetitionService.getAllCompetitions(),
        ClassementService.getInterEcolesStandings()
      ]);

      this.teams = allTeams;
      this.matches = allMatches;
      this.competitions = allCompetitions;
      this.schoolStandings = standings;

    } catch {

      this.showToast(
        'Erreur lors du chargement des statistiques du Dashboard',
        'error'
      );

    } finally {

      this.loading = false;
    }
  }

  // Metrics
  get teamsCount(): number {
    return this.teams.length;
  }

  get matchesPlayed(): number {
    return this.matches.filter(
      (m) => m.status === 'Terminé'
    ).length;
  }

  get matchesUpcoming(): Match[] {
    return this.matches.filter(
      (m) =>
        m.status === 'Planifié' ||
        m.status === 'Reporté'
    );
  }

  get activeCompetitions(): number {
    return this.competitions.filter(
      (c) => c.status === 'En cours'
    ).length;
  }

  get nextMatch(): Match | null {

    if (this.matchesUpcoming.length === 0) {
      return null;
    }

    return [...this.matchesUpcoming].sort((a, b) => {

      const dateA = new Date(
        `${a.date}T${a.time}`
      ).getTime();

      const dateB = new Date(
        `${b.date}T${b.time}`
      ).getTime();

      return dateA - dateB;

    })[0];
  }

  getSchoolColor(school: string): string {

    switch (school) {

      case 'Saint Jean Ingénieur':
        return 'from-blue-500 to-sky-400 text-sky-500 ring-sky-500/10 bg-sky-500/10';

      case 'Saint Jean School of Management':
        return 'from-emerald-500 to-green-400 text-emerald-500 ring-emerald-500/10 bg-emerald-500/10';

      case 'Prépa Vogt':
        return 'from-indigo-600 to-indigo-400 text-indigo-500 ring-indigo-500/10 bg-indigo-500/10';

      case 'CPGE':
        return 'from-pink-500 to-pink-400 text-pink-500 ring-pink-500/10 bg-pink-500/10';

      case 'Prépa Saint Jean Douala':
        return 'from-teal-500 to-teal-400 text-teal-500 ring-teal-500/10 bg-teal-500/10';

      default:
        return 'from-slate-500 to-slate-400 text-slate-500 ring-slate-500/10 bg-slate-500/10';
    }
  }

  getSchoolInitials(school: string): string {

    switch (school) {

      case 'Saint Jean Ingénieur':
        return 'SJI';

      case 'Saint Jean School of Management':
        return 'SJSM';

      case 'Prépa Vogt':
        return 'Vogt';

      case 'CPGE':
        return 'CPGE';

      case 'Prépa Saint Jean Douala':
        return 'PSJD';

      default:
        return 'IUSJ';
    }
  }

  stats = [
    {
      label: 'Équipes Inscrites',
      desc: 'Toutes écoles confondues',
      icon: Users,
      color: 'text-sky-500 bg-sky-500/10 border-sky-100'
    },
    {
      label: 'Matchs Joués',
      desc: 'Résultats validés',
      icon: Activity,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-100'
    },
    {
      label: 'Matchs en Attente',
      desc: 'Planifiés & Reportés',
      icon: Calendar,
      color: 'text-amber-500 bg-amber-500/10 border-amber-100'
    },
    {
      label: 'Tournois Actifs',
      desc: 'En cours d’organisation',
      icon: Trophy,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-100'
    }
  ];
}