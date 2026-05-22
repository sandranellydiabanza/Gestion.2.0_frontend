import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Menu, Bell, Cpu } from 'lucide-angular';

export type UserRole =
  | 'Administrateur'
  | 'Responsable sportif'
  | 'Capitaine d’équipe'
  | 'Étudiant';

export interface User {
  avatarUrl?: string;
  role: UserRole;
}



@Component({
  selector: 'app-navbar',
  imports: [LucideAngularModule,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar  {
  @Input() currentRoute: string = '';
  @Input() currentUser: User | null = null;
  @Input() unreadCount: number = 0;

  @Output() onNavigate = new EventEmitter<string>();
  @Output() onToggleSidebar = new EventEmitter<void>();
  @Output() onRoleChange = new EventEmitter<UserRole>();

  MenuIcon = Menu;
  BellIcon = Bell;
  CpuIcon = Cpu;

  roles: UserRole[] = [
    'Administrateur',
    'Responsable sportif',
    'Capitaine d’équipe',
    'Étudiant',
  ];

  getPageTitle(route: string): string {
    switch (route) {
      case 'dashboard':
        return 'Tableau de bord';

      case 'competitions':
        return 'Gestion des Compétitions';

      case 'equipes':
        return 'Équipes universitaires';

      case 'joueurs':
        return 'Joueurs & Rôles';

      case 'matchs':
        return 'Matchs & Calendrier';

      case 'classements':
        return 'Classements officiels';

      case 'notifications':
        return 'Annonces & Notifications';

      case 'profile':
        return 'Profil utilisateur';

      case 'audit-logs':
        return 'Journal des actions & Audit';

      default:
        return 'IUSJ Sports';
    }
  }

  handleRoleChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as UserRole;
    this.onRoleChange.emit(value);
  }
}
