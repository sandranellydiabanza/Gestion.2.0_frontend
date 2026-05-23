import { CommonModule } from '@angular/common';

import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FormsModule } from '@angular/forms';
import{
  LucideAngularModule,
  Trophy,
  Users,
  UserCheck,
  Calendar,
  Layers,
  Bell,
  User,
  Shield,
  LogOut,
  Activity,
  X
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,FormsModule,LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {


  @Input() currentRoute!: string;
  @Input() currentUser: any =true;
  @Input() unreadCount = 0;
  @Input() isOpen = true;

  navItems: any[] = [];

  readonly Trophy = Trophy;
  readonly Users = Users;
  readonly UserCheck = UserCheck;
  readonly Calendar = Calendar;
  readonly Layers = Layers;
  readonly Bell = Bell;
  readonly UserIcon = User;
  readonly Shield = Shield;
  readonly LogOut = LogOut;
  readonly Activity = Activity;
  readonly X = X;

  ngOnInit(): void {
    if (!this.currentUser) return;

    this.navItems = [
      { id: 'dashboard', label: 'Tableau de bord', icon: this.Activity },
      { id: 'competitions', label: 'Compétitions', icon: this.Trophy },
      { id: 'equipes', label: 'Équipes IUSJ', icon: this.Users },
      { id: 'joueurs', label: 'Joueurs', icon: this.UserCheck },
      { id: 'matchs', label: 'Matchs & Calendrier', icon: this.Calendar },
      { id: 'classements', label: 'Classements', icon: this.Layers },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: this.Bell,
        badge: this.unreadCount
      },
      { id: 'profile', label: 'Profil & Rôles', icon: this.UserIcon },
    ];

    if (
      this.currentUser.role === 'Administrateur' ||
      this.currentUser.role === 'Responsable sportif'
    ) {
      this.navItems.push({
        id: 'audit-logs',
        label: 'Journal de Sécurité',
        icon: this.Shield
      });
    }
  }

  onNavigate(route: string): void {
    console.log('Navigate to:', route);

    if (window.innerWidth < 1024) {
      this.onToggle();
    }
  }

  onLogout(): void {
    console.log('Logout');
  }

  onToggle(): void {
    this.isOpen = !this.isOpen;
  }
}