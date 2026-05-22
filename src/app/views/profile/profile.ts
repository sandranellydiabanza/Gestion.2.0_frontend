import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  User as UserIcon,
  Shield,
  Key,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-angular';

import { User, Etablissement } from '../types';
import {Loginservice } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule , FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {


  @Input() currentUser: User | null = null;

  firstName = '';
  lastName = '';
  school: Etablissement = 'Saint Jean Ingénieur';

  updating = false;
  showToken = false;

  readonly UserIcon = UserIcon;
  readonly ShieldIcon = Shield;
  readonly KeyIcon = Key;
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;
  readonly RefreshCwIcon = RefreshCw;

  schools: Etablissement[] = [
    'Saint Jean Ingénieur',
    'Saint Jean School of Management',
    'Prépa Vogt',
    'CPGE',
    'Prépa Saint Jean Douala'
  ];

  ngOnInit(): void {
    if (this.currentUser) {
      this.firstName = this.currentUser.firstName;
      this.lastName = this.currentUser.lastName;
      this.school =
        this.currentUser.etablissement ||
        'Saint Jean Ingénieur';
    }
  }

  get jwtToken(): string {
    returnLoginservice.getToken() || 'No token found';
  }

  get parts(): string[] {
    return this.jwtToken.split('.');
  }

  get jwtSignature(): string {
    return this.parts[2] || '';
  }

  toggleToken(): void {
    this.showToken = !this.showToken;
  }

  async handleUpdate(): Promise<void> {
    if (!this.firstName.trim() || !this.lastName.trim()) {
      alert('Prénom et Nom requis');
      return;
    }

    this.updating = true;

    try {
      const updated = awaitLoginservice.updateProfile(
        this.firstName,
        this.lastName,
        this.school
      );

      this.currentUser = updated;

      alert('Votre profil académique IUSJ a été mis à jour');

    } catch (error) {

      alert('Une erreur est survenue lors de la modification');

    } finally {

      this.updating = false;

    }
  }
