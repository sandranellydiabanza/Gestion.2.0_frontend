import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  LucideAngularModule,
  Bell,
  Search,
  PlusCircle,
  Check,
  CheckSquare,
  Megaphone,
  RefreshCw,
  X
} from 'lucide-angular';

import {
  SportNotification,
  NotificationType,
  User
} from '../../types/types';

import { Notificationservice } from '../../services/notification/notificationservice';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './notification.html',
  styleUrls: ['./notification.css']
})
export class Notifications implements OnInit {

  @Input() currentUser: User | null = null;

  @Input() onRefreshNotificationsCount: () => void = () => {};

  @Input() showToast: (
    msg: string,
    type: 'success' | 'error'
  ) => void = () => {};

  private notificationService = inject(Notificationservice);

  notifications: SportNotification[] = [];
  filteredNotifs: SportNotification[] = [];

  loading = true;

  search = '';
  selectedType = 'all';

  isNotifOpen = false;

  title = '';
  content = '';

  type: NotificationType = 'announcement';

  saving = false;

  // Icons
  readonly BellIcon = Bell;
  readonly SearchIcon = Search;
  readonly PlusCircleIcon = PlusCircle;
  readonly CheckIcon = Check;
  readonly CheckSquareIcon = CheckSquare;
  readonly MegaphoneIcon = Megaphone;
  readonly RefreshCwIcon = RefreshCw;
  readonly XIcon = X;

  ngOnInit(): void {
    this.loadNotifications();
  }

  get isAuthorizeToAnnounce(): boolean {
    return (
      this.currentUser?.role === 'Administrateur' ||
      this.currentUser?.role === 'Responsable sportif'
    );
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  loadNotifications(): void {

    this.loading = true;

    this.notificationService.getAllNotifications().subscribe({

      next: (data) => {

        this.notifications = data;

        this.applyFilters();

        this.onRefreshNotificationsCount();

        this.loading = false;
      },

      error: () => {

        this.showToast(
          'Impossible de recharger les annonces',
          'error'
        );

        this.loading = false;
      }
    });
  }

  applyFilters(): void {

    this.filteredNotifs = this.notifications.filter((n) => {

      const matchesSearch =
        (n.title ?? '')
          .toLowerCase()
          .includes(this.search.toLowerCase()) ||

        (n.content ?? '')
          .toLowerCase()
          .includes(this.search.toLowerCase());

      const matchesFilter =
        this.selectedType === 'all' ||
        n.type === this.selectedType;

      return matchesSearch && matchesFilter;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onTypeChange(): void {
    this.applyFilters();
  }

  handleMarkAsRead(id: string): void {

    this.notificationService.markAsRead(id).subscribe({

      next: (updated) => {

        this.notifications = updated;

        this.applyFilters();

        this.onRefreshNotificationsCount();
      },

      error: () => {

        this.showToast(
          'Erreur lors du marquage comme lu',
          'error'
        );
      }
    });
  }

  handleMarkAllRead(): void {

    this.notificationService.markAllAsRead().subscribe({

      next: (updated) => {

        this.notifications = updated;

        this.applyFilters();

        this.onRefreshNotificationsCount();

        this.showToast(
          'Tous les messages ont été marqués comme lus',
          'success'
        );
      },

      error: () => {

        this.showToast(
          'Erreur lors du marquage',
          'error'
        );
      }
    });
  }

  handlePublishAnnouncement(): void {

    if (!this.title.trim() || !this.content.trim()) {

      this.showToast(
        'Veuillez remplir tous les champs',
        'error'
      );

      return;
    }

    this.saving = true;

    this.notificationService.createNotification({
      title: this.title,
      content: this.content,
      type: this.type
    }).subscribe({

      next: () => {

        this.showToast(
          'Votre annonce académique a été publiée !',
          'success'
        );

        this.isNotifOpen = false;

        this.title = '';
        this.content = '';

        this.loadNotifications();

        this.saving = false;
      },

      error: () => {

        this.showToast(
          'Erreur de publication de l’annonce',
          'error'
        );

        this.saving = false;
      }
    });
  }

  getNotifIconStyle(type: NotificationType): string {

    switch (type) {

      case 'schedule':
        return 'text-sky-500 bg-sky-50 border-sky-100';

      case 'result':
        return 'text-emerald-500 bg-emerald-50 border-emerald-100';

      case 'match_update':
        return 'text-amber-500 bg-amber-50 border-amber-100';

      default:
        return 'text-purple-500 bg-purple-50 border-purple-100';
    }
  }
}