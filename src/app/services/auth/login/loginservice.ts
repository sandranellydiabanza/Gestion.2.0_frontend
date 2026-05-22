import { Injectable ,inject} from '@angular/core';

import { User, UserRole, Etablissement } from '../../../types/types';
import { getMockUsers, apiSimulate, logAction } from '../../../test/mockData';

export const AUTH_TOKEN_KEY = 'iusj_sports_token';
export const AUTH_USER_KEY = 'iusj_sports_user';

@Injectable({
  providedIn: 'root',
})
export class Loginservice {


  constructor() {}

  // Simulate login
  async login(
    email: string,
    role: UserRole
  ): Promise<{ token: string; user: User }> {

    const users = getMockUsers();

    // Find or simulate user matching the criteria
    let user = users.find(
      u =>
        u.email.toLowerCase() === email.toLowerCase() ||
        (
          u.role === role &&
          u.email.includes(role.toLowerCase().substring(0, 4))
        )
    );

    if (!user) {

      // Create user on-the-fly to prevent blocking development
      const nameParts = email.split('@')[0].split('.');

      const firstName = nameParts[0]
        ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
        : 'Utilisateur';

      const lastName = nameParts[1]
        ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)
        : 'IUSJ';

      user = {
        id: `user-${Date.now()}`,
        email,
        firstName,
        lastName,
        role,
        etablissement:
          role !== 'Administrateur'
            ? 'Saint Jean Ingénieur'
            : undefined,
        avatarUrl:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
      };

      // Save new user
      const currentUsers = [...getMockUsers(), user];

      localStorage.setItem(
        'iusj_sports_users',
        JSON.stringify(currentUsers)
      );
    }

    // Generate mock JWT token
    const mockToken =
      `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.` +
      `${btoa(JSON.stringify(user))}.signature_iusj`;

    // Save to localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, mockToken);

    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(user)
    );

    logAction(
      user.id,
      `${user.firstName} ${user.lastName} (${user.role})`,
      'Login',
      'Authentification utilisateur réussie (Session JWT simulée)'
    );

    return apiSimulate({
      token: mockToken,
      user
    });
  }

  // Get current logged-in user
  getCurrentUser(): User | null {

    const userStr = localStorage.getItem(AUTH_USER_KEY);

    if (!userStr) {
      return null;
    }

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Get current simulated JWT token
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  // Update user profile info
  async updateProfile(
    firstName: string,
    lastName: string,
    etablissement: Etablissement
  ): Promise<User> {

    const currentUser = this.getCurrentUser();

    if (!currentUser) {
      throw new Error('Non authentifié');
    }

    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    currentUser.etablissement = etablissement;

    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(currentUser)
    );

    // Update in database users list
    const users = getMockUsers();

    const updatedUsers = users.map(u =>
      u.id === currentUser.id
        ? currentUser
        : u
    );

    localStorage.setItem(
      'iusj_sports_users',
      JSON.stringify(updatedUsers)
    );

    logAction(
      currentUser.id,
      `${currentUser.firstName} ${currentUser.lastName}`,
      'Profil mis à jour',
      'Mise à jour des informations personnelles.'
    );

    return apiSimulate(currentUser);
  }

  // Logout
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

    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }

  // Simulates router guard check
  checkPermission(
    role: UserRole | undefined,
    requiredRoles: UserRole[]
  ): boolean {

    if (!role) {
      return false;
    }

    return requiredRoles.includes(role);
  }
}