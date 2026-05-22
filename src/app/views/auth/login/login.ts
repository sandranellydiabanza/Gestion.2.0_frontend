import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
type UserRole =
  | 'Administrateur'
  | 'Responsable sportif'
  | 'Capitaine d’équipe'
  | 'Étudiant';

@Component({
  selector: 'app-login',
  imports: [ CommonModule,
  FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {



email: string = 'admin@iusj.org';
  role: UserRole = 'Administrateur';
  loading: boolean = false;

  roles: UserRole[] = [
    'Administrateur',
    'Responsable sportif',
    'Capitaine d’équipe',
    'Étudiant',
  ];

  quickAccounts = [
    {
      name: 'Marc Nkou (Admin)',
      email: 'admin@iusj.org',
      role: 'Administrateur' as UserRole,
    },
    {
      name: 'Aline Zanga (Sport Manager)',
      email: 'responsable@iusj.org',
      role: 'Responsable sportif' as UserRole,
    },
    {
      name: 'Marc Atangana (Capitaine)',
      email: 'capitaine@iusj.org',
      role: 'Capitaine d’équipe' as UserRole,
    },
    {
      name: 'Paul Mbarga (Étudiant)',
      email: 'student@iusj.org',
      role: 'Étudiant' as UserRole,
    },
  ];

  async handleSubmit() {
    if (!this.email) {
      alert('Veuillez entrer une adresse e-mail');
      return;
    }

    this.loading = true;

    try {
      // Simule une requête API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert(`Bienvenue ! Connexion sécurisée réussie.`);
    } catch (error) {
      alert('Erreur lors de la connexion');
    } finally {
      this.loading = false;
    }
  }

  handleQuickSelect(email: string, role: UserRole) {
    this.email = email;
    this.role = role;
  }







}
