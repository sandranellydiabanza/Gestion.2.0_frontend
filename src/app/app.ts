import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from '../app/';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastComponent } from './components/toast/toast.component';

import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { CompetitionsComponent } from './views/competitions/competitions.component';
import { TeamsComponent } from './views/teams/teams.component';
import { PlayersComponent } from './views/players/players.component';
import { MatchesComponent } from './views/matches/matches.component';
import { RankingsComponent } from './views/rankings/rankings.component';
import { NotificationsComponent } from './views/notifications/notifications.component';
import { ProfileComponent } from './views/profile/profile.component';
import { AuditLogsComponent } from './views/audit-logs/audit-logs.component';

import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gestion2.0_frontend');
}
