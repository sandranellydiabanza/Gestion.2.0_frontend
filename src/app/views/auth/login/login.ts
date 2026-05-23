import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Loginservice } from '../../../services/auth/login/loginservice';

type UserRole =
  | 'Administrateur'
  | 'Responsable sportif'
  | 'Capitaine equipe'
  | 'Étudiant';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private loginService = inject(Loginservice);
  private router = inject(Router);

  @Input() showToast: (msg: string, type: 'success' | 'error') => void = () => {};

  email = 'admin@iusj.org';
  role: UserRole = 'Administrateur';
  password = '';
  loading = false;
async handleSubmit() {

  if (!this.email || !this.password) {
    this.showToast('Email et mot de passe requis', 'error');
    return;
  }

  this.loading = true;

  try {

    const result = await this.loginService.loginWithPassword(
      this.email,
      this.password
    );
console.log('Login result:', result);
console.log('Current user after login:');
    this.showToast('Connexion réussie 🎉', 'success');

    // this.router.navigate(['/dashboard']);

  } catch (error) {

    this.showToast('Email ou mot de passe incorrect', 'error');

  } finally {
    this.loading = false;
  }
}

  handleQuickSelect(email: string, role: UserRole) {
    this.email = email;
    this.role = role;
  }
}