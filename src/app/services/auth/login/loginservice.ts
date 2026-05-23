import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User, Etablissement } from '../../../types/types';
import { getMockUsers, apiSimulate, logAction } from '../../../test/mockData';

export const AUTH_TOKEN_KEY = 'iusj_sports_token';
export const AUTH_USER_KEY = 'iusj_sports_user';

@Injectable({
  providedIn: 'root',
})
export class Loginservice {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ---------------- LOGIN ----------------
  async loginWithPassword(email: string, motDePasse: string): Promise<{ token: string; user: User }> {

    const users = getMockUsers();

    let user = users.find(
      u =>
        u.email.toLowerCase() === email.toLowerCase() &&
        (u as any).motDePasse === motDePasse
    );

    // 🔥 si user pas trouvé → création fake user
    if (!user) {

      const nameParts = email.split('@')[0].split('.');

      user = {
        id: `user-${Date.now()}`,
        email,
        firstName: nameParts[0] || 'Utilisateur',
        lastName: nameParts[1] || 'IUSJ',
        role: 'Étudiant', // ✅ valeur par défaut
        etablissement: 'Saint Jean Ingénieur',
        avatarUrl:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      } as User;

      const currentUsers = [...getMockUsers(), user];

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('iusj_sports_users', JSON.stringify(currentUsers));
      }
    }

    // 🔥 fake JWT
    const mockToken =
      `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.` +
      `${btoa(JSON.stringify(user))}.signature_iusj`;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    }

    logAction(
      user.id,
      `${user.firstName} ${user.lastName} (${user.role})`,
      'Login',
      'Authentification utilisateur réussie'
    );

    return apiSimulate({ token: mockToken, user });
  }

  // ---------------- GET USER ----------------
  getCurrentUser(): User | null {

    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const userStr = localStorage.getItem(AUTH_USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // ---------------- TOKEN ----------------
  getToken(): string | null {

    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  // ---------------- AUTH ----------------
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  // ---------------- UPDATE PROFILE ----------------
  async updateProfile(firstName: string, lastName: string, etablissement: Etablissement): Promise<User> {

    const currentUser = this.getCurrentUser();

    if (!currentUser) {
      throw new Error('Non authentifié');
    }

    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    currentUser.etablissement = etablissement;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
    }

    logAction(
      currentUser.id,
      `${currentUser.firstName} ${currentUser.lastName}`,
      'Profil mis à jour',
      'Mise à jour des informations personnelles.'
    );

    return apiSimulate(currentUser);
  }

  // ---------------- LOGOUT ----------------
  logout(): void {

    const currentUser = this.getCurrentUser();

    if (currentUser) {
      logAction(
        currentUser.id,
        `${currentUser.firstName} ${currentUser.lastName}`,
        'Logout',
        'Déconnexion session utilisateur.'
      );
    }

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }
}