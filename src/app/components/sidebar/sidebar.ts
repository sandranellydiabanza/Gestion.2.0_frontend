import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

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
export class Sidebar implements OnInit   {
  private router = inject(Router);


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
      { id: '', label: 'Tableau de bord', icon: this.Activity },
      { id: 'competition', label: 'Compétitions', icon: this.Trophy },
      { id: 'team', label: 'Équipes IUSJ', icon: this.Users },
      { id: 'players', label: 'Joueurs', icon: this.UserCheck },
      { id: 'matches', label: 'Matchs & Calendrier', icon: this.Calendar },
      { id: 'rankings', label: 'Classements', icon: this.Layers },
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
        id: 'auditlogs',
        label: 'Journal de Sécurité',
        icon: this.Shield
      });
    }
  }

  onNavigate(route: string): void {

    // console.log('Navigate to:', route);
this.router.navigate([`/${route}`]);
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
