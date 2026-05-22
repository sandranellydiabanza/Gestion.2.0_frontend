import { CommonModule } from '@angular/common';

import { Component, Input,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import{
  Trophy,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Layers,
  Search,
  X,
  Loader2,
  ListFilter
} from 'lucide-angular';
import { Competitionservice } from '../../services/competition/competitionservice';
import { LucideAngularModule, Menu, Bell } from 'lucide-angular';
import {
  CompetitionType,
  SportType,
  CompetitionStatus,
  User,
  Competition
} from '../../types/types';
@Component({
  selector: 'app-competitions',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule
  ],
  templateUrl: './competitions.html',
  styleUrl: './competitions.css',
})
export class Competitions {
  private competitionService = inject(Competitionservice);

  @Input() currentUser: User | null = null;
  @Input() showToast!: (msg: string, type: 'success' | 'error') => void;

  readonly Trophy = Trophy;
  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Calendar = Calendar;
  readonly Layers = Layers;
  readonly Search = Search;
  readonly X = X;
  readonly Loader2 = Loader2;
  readonly ListFilter = ListFilter;

  competitions: Competition[] = [];

  loading = true;
  saving = false;

  searchTerm = '';
  filterType = 'all';

  // Modal
  isModalOpen = false;
  editComp: Competition | null = null;

  // Form
  name = '';
  type: CompetitionType = 'championnat';
  sport: SportType = 'Football';
  startDate = '';
  endDate = '';
  rules = '';
  status: CompetitionStatus = 'Planifié';

  formErrors: Record<string, string> = {};

  get isAuthorized(): boolean {
    return (
      this.currentUser?.role === 'Administrateur' ||
      this.currentUser?.role === 'Responsable sportif'
    );
  }

  ngOnInit(): void {
    this.fetchCompetitions();
  }

  async fetchCompetitions(): Promise<void> {
    this.loading = true;

    try {
      const data = await this.competitionService.getAllCompetitions();
      this.competitions = data;
    } catch {
      this.showToast(
        'Impossible de recharger les compétitions',
        'error'
      );
    } finally {
      this.loading = false;
    }
  }

  openAddModal(): void {
    this.editComp = null;

    this.name = '';
    this.type = 'championnat';
    this.sport = 'Football';
    this.startDate = '2026-06-01';
    this.endDate = '2026-06-30';

    this.rules =
      'Matchs de 90 minutes. Victoire standard 3 pts, Nul 1 pt, Défaite 0.';

    this.status = 'Planifié';

    this.formErrors = {};
    this.isModalOpen = true;
  }

  openEditModal(comp: Competition): void {
    this.editComp = comp;

    this.name = comp.name;
    this.type = comp.type;
    this.sport = comp.sport;
    this.startDate = comp.startDate;
    this.endDate = comp.endDate;
    this.rules = comp.rules;
    this.status = comp.status;

    this.formErrors = {};
    this.isModalOpen = true;
  }

  validateForm(): boolean {

    const errors: Record<string, string> = {};

    if (!this.name.trim()) {
      errors['name'] = 'Nom de compétition requis';
    }

    if (this.name.length < 5) {
      errors['name'] =
        'Le nom doit comporter au moins 5 caractères';
    }

    if (!this.startDate) {
      errors['startDate'] = 'Date de début requise';
    }

    if (!this.endDate) {
      errors['endDate'] = 'Date de fin requise';
    }

    if (
      this.startDate &&
      this.endDate &&
      new Date(this.startDate) > new Date(this.endDate)
    ) {
      errors['endDate'] =
        'La date de fin doit être postérieure à la date de début';
    }

    if (!this.rules.trim()) {
      errors['rules'] =
        'Les règles du tournoi sont obligatoires';
    }

    this.formErrors = errors;

    return Object.keys(errors).length === 0;
  }

  async handleSave(event: Event): Promise<void> {

    event.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.saving = true;

    try {

      if (this.editComp) {

        const updated =
          await this.competitionService.updateCompetition(
            this.editComp.id,
            {
              name: this.name,
              type: this.type,
              sport: this.sport,
              startDate: this.startDate,
              endDate: this.endDate,
              rules: this.rules,
              status: this.status
            }
          );

        this.showToast(
          `Compétition "${updated.name}" mise à jour avec succès`,
          'success'
        );

      } else {

        const created =
          await this.competitionService.createCompetition({
            name: this.name,
            type: this.type,
            sport: this.sport,
            startDate: this.startDate,
            endDate: this.endDate,
            rules: this.rules,
            status: this.status
          });

        this.showToast(
          `Compétition "${created.name}" créée et planifiée`,
          'success'
        );
      }

      this.isModalOpen = false;

      this.fetchCompetitions();

    } catch {

      this.showToast(
        'Erreur lors de l’enregistrement de la compétition',
        'error'
      );

    } finally {
      this.saving = false;
    }
  }

  async handleDelete(id: string, name: string): Promise<void> {

    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la compétition "${name}" ?`
    );

    if (confirmed) {

      try {

        await this.competitionService.deleteCompetition(id);

        this.showToast(
          'Compétition supprimée avec succès',
          'success'
        );

        this.fetchCompetitions();

      } catch {

        this.showToast(
          'Une erreur est survenue lors de la suppression',
          'error'
        );
      }
    }
  }

  get filteredCompetitions(): Competition[] {

    return this.competitions.filter((c) => {

      const matchesSearch =
        c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.sport.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType =
        this.filterType === 'all' ||
        c.type === this.filterType;

      return matchesSearch && matchesType;
    });
  }
}
