import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { Sidebar } from './components/sidebar/sidebar';
import { Navbar } from './components/navbar/navbar';
import { Toast } from './components/toast/toast';

import { Login } from './views/auth/login/login';
import { Dashboard } from './views/dashboard/dashboard';
import { Competitions } from './views/competitions/competitions';
import { Teams } from './views/teams/teams';
import { Players } from './views/players/players';
import { Matches } from './views/matches/matches';
import { Rankings } from './views/rankings/rankings';
import { Notifications } from './views/notification/notification';
import { Profile } from './views/profile/profile';
import { AuditLogs } from './views/audit-logs/audit-logs';

import { Loginservice } from './services/auth/login/loginservice';
import { Notificationservice } from './services/notification/notificationservice';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    CommonModule,
    Sidebar,
    Navbar,
    Toast,
    Login,
    Dashboard,
    Competitions,
    Teams,
    Players,
    Matches,
    Rankings,
    Notifications,
    Profile,
    AuditLogs,
    RouterOutlet
  ],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private authService = inject(Loginservice);
  private notificationService = inject(Notificationservice);

  protected readonly title = signal('gestion2.0_frontend');

  currentUser: any = null;
  currentRoute: string = 'dashboard';
  unreadCount: number = 0;
  sidebarOpen: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  ngOnInit(): void {

    const user = this.authService.getCurrentUser();

    if (user) {
      this.currentUser = user;
      this.loadUnreadCount();
    }
  }
  showToast(
    message: string,
    type: 'success' | 'error'
  ): void {

    this.toastMessage = message;
    this.toastType = type;
  }

  handleCloseToast(): void {
    this.toastMessage = '';
  }

  async loadUnreadCount(): Promise<void> {

    if (!this.authService.isAuthenticated()) {
      return;
    }

    try {

      const data = await firstValueFrom(
        this.notificationService.getAllNotifications()
      );

      const count = data.filter(
        (n: any) => !n.isRead
      ).length;

      this.unreadCount = count;

    } catch (error) {
      console.error(error);
    }
  }

  handleLoginSuccess(user: any): void {

    this.currentUser = user;
    this.currentRoute = 'dashboard';

    this.loadUnreadCount();
  }

  handleLogout(): void {

    this.authService.logout();

    this.currentUser = null;

    this.showToast(
      'Déconnexion réussie',
      'success'
    );
  }

  handleRoleChange(newRole: any): void {

    if (!this.currentUser) {
      return;
    }

    const updatedUser = {
      ...this.currentUser,
      role: newRole
    };

    localStorage.setItem(
      'iusj_sports_user',
      JSON.stringify(updatedUser)
    );

    const usersStr = localStorage.getItem(
      'iusj_sports_users'
    );

    if (usersStr) {

      try {

        const users = JSON.parse(usersStr);

        const updatedUsers = users.map(
          (u: any) =>
            u.id === this.currentUser.id
              ? updatedUser
              : u
        );

        localStorage.setItem(
          'iusj_sports_users',
          JSON.stringify(updatedUsers)
        );

      } catch (error) {
        console.error(error);
      }
    }

    this.currentUser = updatedUser;

    this.showToast(
      `Rôle de test changé en : ${newRole}`,
      'success'
    );

    if (
      this.currentRoute === 'audit-logs' &&
      newRole !== 'Administrateur' &&
      newRole !== 'Responsable sportif'
    ) {
      this.currentRoute = 'dashboard';
    }
  }

  handleProfileUpdated(updatedUser: any): void {
    this.currentUser = updatedUser;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  navigate(route:any): void {

    this.currentRoute = route;

    this.loadUnreadCount();
  }
}