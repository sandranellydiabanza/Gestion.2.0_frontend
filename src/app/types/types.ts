/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Etablissement =
  | 'Saint Jean Ingénieur'
  | 'Saint Jean School of Management'
  | 'Prépa Vogt'
  | 'CPGE'
  | 'Prépa Saint Jean Douala';

export type UserRole = 'Administrateur' | 'Responsable sportif' | 'Capitaine d’équipe' | 'Étudiant';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  etablissement?: Etablissement;
  avatarUrl?: string;
}

export type SportType = 'Football' | 'Basketball' | 'Handball' | 'Volleyball';

export type CompetitionType = 'championnat' | 'coupe' | 'élimination directe';

export type CompetitionStatus = 'Planifié' | 'En cours' | 'Terminé';

export interface Competition {
  id: string;
  name: string;
  type: CompetitionType;
  sport: SportType;
  startDate: string;
  endDate: string;
  rules: string;
  status: CompetitionStatus;
  teamsCount: number;
}

export interface Team {
  id: string;
  name: string;
  etablissement: Etablissement;
  filiere: string;
  logoColor: string; // Tailwind color class or hex code
  captainId?: string;
  captainName?: string;
  playersCount: number;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  number: number;
  position: string;
  className: string; // e.g., "SJI 3", "Prepa Vogt 1"
  photoUrl?: string;
  teamId: string;
}

export type MatchStatus = 'Planifié' | 'En cours' | 'Terminé' | 'Reporté';

export interface CardRecord {
  id: string;
  playerId: string;
  playerName: string;
  teamId: string;
  type: 'yellow' | 'red';
  minute: number;
}

export interface GoalRecord {
  id: string;
  scorerId: string;
  scorerName: string;
  teamId: string;
  minute: number;
}

export interface Match {
  id: string;
  competitionId: string;
  competitionName: string;
  teamAId: string;
  teamAName: string;
  teamALogoColor: string;
  teamBId: string;
  teamBName: string;
  teamBLogoColor: string;
  scoreA?: number;
  scoreB?: number;
  date: string;
  time: string;
  pitch: string; // Terrain (e.g. "Terrain A", "Gymnase Vogt")
  referee: string;
  status: MatchStatus;
  cards: CardRecord[];
  goals: GoalRecord[];
  reportReason?: string;
}

export interface Standing {
  teamId: string;
  teamName: string;
  etablissement: Etablissement;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface EtablissementStanding {
  etablissement: Etablissement;
  teamsCount: number;
  matchesPlayed: number;
  matchesWon: number;
  points: number;
}

export type NotificationType = 'match_update' | 'schedule' | 'result' | 'announcement';

export interface SportNotification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  date: string;
  isRead: boolean;
}

export interface ActionLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}
