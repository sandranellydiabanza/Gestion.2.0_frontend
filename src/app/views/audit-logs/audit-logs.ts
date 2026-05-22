import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Input } from '@angular/core';
import {
  Shield,
  Search,
  RefreshCw,
  Trash2,
  Clock
} from 'lucide-angular';
import { LucideAngularModule, Menu, Bell } from 'lucide-angular';

import { ActionLog,User } from '../../types/types';
import { getMockLogs } from '../../test/mockData';
@Component({
  selector: 'app-audit-logs',
  imports: [CommonModule,FormsModule,LucideAngularModule],
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.css',
})
export class AuditLogs {
   

  @Input() currentUser: User | null = null;
  @Input() showToast!: (msg: string, type: 'success' | 'error') => void;

  readonly Shield = Shield;
  readonly Search = Search;
  readonly RefreshCw = RefreshCw;
  readonly Trash2 = Trash2;
  readonly Clock = Clock;

  logs: ActionLog[] = [];
  loading = true;
  search = '';

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;

    try {
      const data = getMockLogs();
      this.logs = data;
    } catch {
      this.showToast?.(
        'Impossible de récupérer le journal d’audit',
        'error'
      );
    } finally {
      this.loading = false;
    }
  }

  handleClearLogs(): void {
    const confirmed = window.confirm(
      'Voulez-vous vraiment effacer l’historique du journal d’audit de sécurité ?'
    );

    if (confirmed) {
      localStorage.setItem('iusj_sports_logs', JSON.stringify([]));
      this.logs = [];

      this.showToast?.(
        'Journal d’audit réinitialisé avec succès',
        'success'
      );
    }
  }

  get filteredLogs(): ActionLog[] {
    return this.logs.filter((log) => {
      return (
        log.userName.toLowerCase().includes(this.search.toLowerCase()) ||
        log.action.toLowerCase().includes(this.search.toLowerCase()) ||
        log.details.toLowerCase().includes(this.search.toLowerCase())
      );
    });
  }
}