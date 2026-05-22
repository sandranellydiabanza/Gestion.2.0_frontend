import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Award,
  Trophy,
  RefreshCw,
  BarChart3,
  ShieldAlert
} from 'lucide-angular';

import {
  Standing,
  EtablissementStanding,
  Competition
} from '../types';

import { CompetitionService } from '../services/competition.service';
import { ClassementService } from '../services/classement.service';

@Component({
  selector: 'app-rankings',
  imports: [CommonModule ,FormsModule],
  templateUrl: './rankings.html',
  styleUrl: './rankings.css',
})
export class Rankings{


  readonly AwardIcon = Award;
  readonly TrophyIcon = Trophy;
  readonly RefreshCwIcon = RefreshCw;
  readonly BarChart3Icon = BarChart3;
  readonly ShieldAlertIcon = ShieldAlert;

  competitions: Competition[] = [];
  selectedCompId = '';

  teamStandings: Standing[] = [];
  schoolStandings: EtablissementStanding[] = [];

  loading = true;
  loadingComp = false;

  async ngOnInit(): Promise<void> {
    await this.loadInitialData();
  }

  async loadInitialData(): Promise<void> {

    this.loading = true;

    try {

      const [allComps, interSchool] = await Promise.all([
        CompetitionService.getAllCompetitions(),
        ClassementService.getInterEcolesStandings()
      ]);

      this.competitions = allComps;
      this.schoolStandings = interSchool;

      const activeComp =
        allComps.find(c => c.status === 'En cours') ||
        allComps[0];

      if (activeComp) {
        this.selectedCompId = activeComp.id;
        await this.loadTeamStandings();
      }

    } catch (error) {

      alert('Erreur lors du chargement des classements');

    } finally {

      this.loading = false;

    }
  }

  async onCompetitionChange(): Promise<void> {
    await this.loadTeamStandings();
  }

  async loadTeamStandings(): Promise<void> {

    if (!this.selectedCompId) return;

    this.loadingComp = true;

    try {

      const standings =
        await ClassementService.getStandings(
          this.selectedCompId
        );

      this.teamStandings = standings;

    } catch (error) {

      alert(
        'Impossible de calculer le classement de cette compétition'
      );

    } finally {

      this.loadingComp = false;

    }
  }

  getSchoolLogoStyle(schoolName: string): string {

    switch (schoolName) {

      case 'Saint Jean Ingénieur':
        return 'text-sky-500 bg-sky-50 border-sky-200';

      case 'Saint Jean School of Management':
        return 'text-emerald-500 bg-emerald-50 border-emerald-200';

      case 'Prépa Vogt':
        return 'text-indigo-500 bg-indigo-50 border-indigo-200';

      case 'CPGE':
        return 'text-pink-500 bg-pink-50 border-pink-200';

      case 'Prépa Saint Jean Douala':
        return 'text-teal-500 bg-teal-50 border-teal-200';

      default:
        return 'text-slate-500 bg-slate-50 border-slate-200';
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
}