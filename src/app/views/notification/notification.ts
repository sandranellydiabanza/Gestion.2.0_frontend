import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Menu, Bell } from 'lucide-angular';
import{
  Bell,
  Search,
  PlusCircle,
  Check,
  CheckSquare,
  Megaphone,
  RefreshCw,
  
} from 'lucide-angular';

import {
  SportNotification,
  NotificationType,
  User
} from '../types';

import { NotificationService } from '../services/notification.service';



@Component({
  selector: 'app-notification',
  imports: [CommonModule ,FormsModule,LucideAngularModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification {


  @Input() currentUser: User | null = null;

  @Input() onRefreshNotificationsCount!: () => void;

  @Input() showToast!: (
    msg: string,
    type: 'success' | 'error'
  ) => void;

  notifications: SportNotification[] = [];
  filteredNotifs: SportNotification[] = [];

  loading = true;

  search = '';
  selectedType = 'all';

  // Modal creation
  isNotifOpen = false;

  title = '';
  content = '';

  type: NotificationType = 'announcement';

  saving = false;

  readonly BellIcon = Bell;
  readonly SearchIcon = Search;
  readonly PlusCircleIcon = PlusCircle;
  readonly CheckIcon = Check;
  readonly CheckSquareIcon = CheckSquare;
  readonly MegaphoneIcon = Megaphone;
  readonly RefreshCwIcon = RefreshCw;
  readonly XIcon = X;

  constructor(
    private notificationService: NotificationService
  ) {}

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

  async loadNotifications(): Promise<void> {
    this.loading = true;

    try {
      const data =
        await this.notificationService.getAllNotifications();

      this.notifications = data;

      this.applyFilters();

      this.onRefreshNotificationsCount();
    } catch {
      this.showToast(
        'Impossible de recharger les annonces',
        'error'
      );
    } finally {
      this.loading = false;
    }
  }

  applyFilters(): void {
    this.filteredNotifs = this.notifications.filter((n) => {

      const matchesSearch =
        n.title.toLowerCase().includes(this.search.toLowerCase()) ||
        n.content.toLowerCase().includes(this.search.toLowerCase());

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

  async handleMarkAsRead(id: string): Promise<void> {
    try {
      const updated =
        await this.notificationService.markAsRead(id);

      this.notifications = updated;

      this.applyFilters();

      this.onRefreshNotificationsCount();

    } catch {
      this.showToast(
        'Erreur lors du marquage comme lu',
        'error'
      );
    }
  }

  async handleMarkAllRead(): Promise<void> {
    try {

      const updated =
        await this.notificationService.markAllAsRead();

      this.notifications = updated;

      this.applyFilters();

      this.onRefreshNotificationsCount();

      this.showToast(
        'Tous les messages ont été marqués comme lus',
        'success'
      );

    } catch {
      this.showToast('Erreur', 'error');
    }
  }

  async handlePublishAnnouncement(): Promise<void> {

    if (!this.title.trim() || !this.content.trim()) {

      this.showToast(
        'Veuillez remplir tous les champs',
        'error'
      );

      return;
    }

    this.saving = true;

    try {

      await this.notificationService.createNotification({
        title: this.title,
        content: this.content,
        type: this.type
      });

      this.showToast(
        'Votre annonce académique a été publiée !',
        'success'
      );

      this.isNotifOpen = false;

      this.title = '';
      this.content = '';

      await this.loadNotifications();

    } catch {

      this.showToast(
        'Erreur de publication de l’annonce',
        'error'
      );

    } finally {
      this.saving = false;
    }
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