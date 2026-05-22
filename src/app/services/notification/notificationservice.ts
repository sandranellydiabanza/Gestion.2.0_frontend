import { Injectable ,inject} from '@angular/core';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { SportNotification, NotificationType } from '../../types/types';
import { getMockNotifications } from '../../test/mockData';

@Injectable({
  providedIn: 'root',
})
export class Notificationservice {
  
  private readonly STORAGE_KEY = 'iusj_sports_notifications';

  constructor() {}

  getAllNotifications(): Observable<SportNotification[]> {
    return this.apiSimulate(this.getNotifications());
  }

  markAsRead(id: string): Observable<SportNotification[]> {
    const notifications = this.getNotifications();

    const updated = notifications.map(notification =>
      notification.id === id
        ? { ...notification, isRead: true }
        : notification
    );

    this.saveNotifications(updated);

    return this.apiSimulate(updated);
  }

  markAllAsRead(): Observable<SportNotification[]> {
    const notifications = this.getNotifications();

    const updated = notifications.map(notification => ({
      ...notification,
      isRead: true
    }));

    this.saveNotifications(updated);

    return this.apiSimulate(updated);
  }

  createNotification(
    notification: Omit<SportNotification, 'id' | 'date' | 'isRead'>
  ): Observable<SportNotification> {

    const notifications = this.getNotifications();

    const newNotification: SportNotification = {
      ...notification,
      id: `n-${Date.now()}`,
      date: new Date().toISOString(),
      isRead: false
    };

    notifications.unshift(newNotification);

    this.saveNotifications(notifications);

    return this.apiSimulate(newNotification);
  }

  private getNotifications(): SportNotification[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);

    if (stored) {
      return JSON.parse(stored);
    }

    const mockNotifications = getMockNotifications();
    this.saveNotifications(mockNotifications);

    return mockNotifications;
  }

  private saveNotifications(notifications: SportNotification[]): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(notifications)
    );
  }

  private apiSimulate<T>(data: T): Observable<T> {
    return of(data).pipe(delay(500));
  }
}
