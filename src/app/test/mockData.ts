/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  Competition,
  Team,
  Player,
  Match,
  SportNotification,
  ActionLog,
  Standing,
  EtablissementStanding,
  User,
  UserRole,
  Etablissement
} from '../types/types';

// Initial Mock Data Sets
const INITIAL_USERS: User[] = [
  { id: 'u1', email: 'admin@iusj.org', firstName: 'Jean-Marc', lastName: 'Nkou', role: 'Administrateur', etablissement: 'Saint Jean Ingénieur', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
  { id: 'u2', email: 'responsable@iusj.org', firstName: 'Aline', lastName: 'Zanga', role: 'Responsable sportif', etablissement: 'Saint Jean School of Management', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces' },
  { id: 'u3', email: 'capitaine@iusj.org', firstName: 'Marc', lastName: 'Atangana', role: 'Capitaine d’équipe', etablissement: 'Saint Jean Ingénieur', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' },
  { id: 'u4', email: 'student@iusj.org', firstName: 'Paul', lastName: 'Mbarga', role: 'Étudiant', etablissement: 'Prépa Vogt', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces' }
];

const INITIAL_COMPETITIONS: Competition[] = [
  {
    id: 'c1',
    name: 'Championnat Inter-Établissements IUSJ 2026',
    type: 'championnat',
    sport: 'Football',
    startDate: '2026-05-01',
    endDate: '2026-06-25',
    rules: 'Matchs de 90 minutes. Victoire = 3 points, Nul = 1 point, Défaite = 0 point. Remplacement libre (maximum 5).',
    status: 'En cours',
    teamsCount: 5,
  },
  {
    id: 'c2',
    name: 'Coupe de l’Ingénieur Basket-ball',
    type: 'coupe',
    sport: 'Basketball',
    startDate: '2026-06-01',
    endDate: '2026-06-20',
    rules: 'Élimination directe. Matchs de 4×10 minutes. Prolongations de 5 minutes si égalité.',
    status: 'Planifié',
    teamsCount: 4,
  },
  {
    id: 'c3',
    name: 'Tournoi d’Ouverture Volleyball',
    type: 'élimination directe',
    sport: 'Volleyball',
    startDate: '2026-04-10',
    endDate: '2026-04-30',
    rules: 'Sets de 25 points, tie-break à 15 points. Meilleurs des 3 sets.',
    status: 'Terminé',
    teamsCount: 4,
  }
];

const INITIAL_TEAMS: Team[] = [
  {
    id: 't1',
    name: 'SJI Génie Logiciel FC',
    etablissement: 'Saint Jean Ingénieur',
    filiere: 'Génie Logiciel',
    logoColor: '#38bdf8', // Blue sky
    captainId: 'p1',
    captainName: 'Marc Atangana',
    playersCount: 8,
  },
  {
    id: 't2',
    name: 'SJSM Finance Kings',
    etablissement: 'Saint Jean School of Management',
    filiere: 'Finance & Comptabilité',
    logoColor: '#22c55e', // Green
    captainId: 'p4',
    captainName: 'Yannick Noah',
    playersCount: 7,
  },
  {
    id: 't3',
    name: 'Vogt Lions',
    etablissement: 'Prépa Vogt',
    filiere: 'MPSI - PCSI',
    logoColor: '#6366f1', // Indigo
    captainId: 'p7',
    captainName: 'Arthur Nguene',
    playersCount: 6,
  },
  {
    id: 't4',
    name: 'CPGE Titans',
    etablissement: 'CPGE',
    filiere: 'Classes Préparatoires',
    logoColor: '#ec4899', // Pink
    captainId: 'p9',
    captainName: 'Stéphane Belinga',
    playersCount: 5,
  },
  {
    id: 't5',
    name: 'Douala Sharks',
    etablissement: 'Prépa Saint Jean Douala',
    filiere: 'Tronc Commun',
    logoColor: '#14b8a6', // Teal
    captainId: 'p11',
    captainName: 'Olivier Kamdem',
    playersCount: 6,
  },
  {
    id: 't6',
    name: 'SJI Réseaux & Télécoms',
    etablissement: 'Saint Jean Ingénieur',
    filiere: 'Réseaux & Sécurité',
    logoColor: '#f59e0b', // Amber
    captainId: 'p14',
    captainName: 'Lucas Etoa',
    playersCount: 5,
  }
];

const INITIAL_PLAYERS: Player[] = [
  // SJI Génie Logiciel
  { id: 'p1', firstName: 'Marc', lastName: 'Atangana', number: 10, position: 'Milieu', className: 'SJI 4', teamId: 't1' },
  { id: 'p2', firstName: 'Cédric', lastName: 'Fouda', number: 9, position: 'Attaquant', className: 'SJI 3', teamId: 't1' },
  { id: 'p3', firstName: 'Stève', lastName: 'Ondoua', number: 1, position: 'Gardien', className: 'SJI 5', teamId: 't1' },
  { id: 'p15', firstName: 'Samuel', lastName: 'Eto', number: 7, position: 'Attaquant', className: 'SJI 3', teamId: 't1' },
  { id: 'p16', firstName: 'Michel', lastName: 'Abena', number: 4, position: 'Défenseur', className: 'SJI 4', teamId: 't1' },
  { id: 'p17', firstName: 'Jean', lastName: 'Mbia', number: 6, position: 'Milieu', className: 'SJI 3', teamId: 't1' },
  { id: 'p18', firstName: 'Paul', lastName: 'Bilolo', number: 2, position: 'Défenseur', className: 'SJI 5', teamId: 't1' },
  { id: 'p19', firstName: 'David', lastName: 'Nkolo', number: 11, position: 'Ailier', className: 'SJI 3', teamId: 't1' },

  // SJSM Finance Kings
  { id: 'p4', firstName: 'Yannick', lastName: 'Noah', number: 8, position: 'Milieu', className: 'SJSM 3', teamId: 't2' },
  { id: 'p5', firstName: 'Emmanuel', lastName: 'Simo', number: 10, position: 'Attaquant', className: 'SJSM 2', teamId: 't2' },
  { id: 'p6', firstName: 'Christian', lastName: 'Talla', number: 5, position: 'Défenseur', className: 'SJSM 3', teamId: 't2' },
  { id: 'p20', firstName: 'Loïc', lastName: 'Mvogo', number: 1, position: 'Gardien', className: 'SJSM 1', teamId: 't2' },
  { id: 'p21', firstName: 'Arnaud', lastName: 'Foko', number: 14, position: 'Défenseur', className: 'SJSM 2', teamId: 't2' },
  { id: 'p22', firstName: 'Boris', lastName: 'Ebanda', number: 3, position: 'Défenseur', className: 'SJSM 3', teamId: 't2' },
  { id: 'p23', firstName: 'Francis', lastName: 'Ngannou', number: 9, position: 'Pivot', className: 'SJSM 2', teamId: 't2' },

  // Vogt Lions
  { id: 'p7', firstName: 'Arthur', lastName: 'Nguene', number: 11, position: 'Attaquant', className: 'Sup Vogt', teamId: 't3' },
  { id: 'p8', firstName: 'Bertrand', lastName: 'Mballa', number: 4, position: 'Défenseur', className: 'Spé Vogt', teamId: 't3' },
  { id: 'p24', firstName: 'Gilles', lastName: 'Tchoffo', number: 1, position: 'Gardien', className: 'Sup Vogt', teamId: 't3' },
  { id: 'p25', firstName: 'Hervé', lastName: 'Kengne', number: 8, position: 'Milieu', className: 'Spé Vogt', teamId: 't3' },
  { id: 'p26', firstName: 'Patrick', lastName: 'Mboma', number: 9, position: 'Attaquant', className: 'Sup Vogt', teamId: 't3' },
  { id: 'p27', firstName: 'Simon', lastName: 'Nlend', number: 5, position: 'Milieu', className: 'Spé Vogt', teamId: 't3' },

  // CPGE Titans
  { id: 'p9', firstName: 'Stéphane', lastName: 'Belinga', number: 7, position: 'Meneur', className: 'CPGE 2', teamId: 't4' },
  { id: 'p10', firstName: 'Didier', lastName: 'Yebga', number: 13, position: 'Ailier', className: 'CPGE 1', teamId: 't4' },
  { id: 'p28', firstName: 'Daniel', lastName: 'Kana', number: 12, position: 'Pivot', className: 'CPGE 2', teamId: 't4' },
  { id: 'p29', firstName: 'Yves', lastName: 'Sop', number: 10, position: 'Arrière', className: 'CPGE 1', teamId: 't4' },
  { id: 'p30', firstName: 'Jules', lastName: 'Ngassa', number: 2, position: 'Défenseur', className: 'CPGE 2', teamId: 't4' },

  // Douala Sharks
  { id: 'p11', firstName: 'Olivier', lastName: 'Kamdem', number: 9, position: 'Attaquant', className: 'Douala 1', teamId: 't5' },
  { id: 'p12', firstName: 'Pierre', lastName: 'Ngoma', number: 6, position: 'Milieu', className: 'Douala 2', teamId: 't5' },
  { id: 'p31', firstName: 'William', lastName: 'Aka', number: 1, position: 'Gardien', className: 'Douala 1', teamId: 't5' },
  { id: 'p32', firstName: 'Thierry', lastName: 'Ewane', number: 3, position: 'Défenseur', className: 'Douala 2', teamId: 't5' },
  { id: 'p33', firstName: 'Rodrigue', lastName: 'Nguem', number: 8, position: 'Milieu', className: 'Douala 1', teamId: 't5' },
  { id: 'p34', firstName: 'Eric', lastName: 'Tati', number: 10, position: 'Ailier', className: 'Douala 2', teamId: 't5' },

  // SJI Réseaux & Télécoms
  { id: 'p14', firstName: 'Lucas', lastName: 'Etoa', number: 10, position: 'Meneur', className: 'SJI 3', teamId: 't6' },
  { id: 'p35', firstName: 'Félix', lastName: 'Wamba', number: 8, position: 'Ailier', className: 'SJI 4', teamId: 't6' },
  { id: 'p36', firstName: 'Cyrille', lastName: 'Kono', number: 1, position: 'Gardien', className: 'SJI 3', teamId: 't6' },
  { id: 'p37', firstName: 'Hassan', lastName: 'Bello', number: 2, position: 'Défenseur', className: 'SJI 4', teamId: 't6' },
  { id: 'p38', firstName: 'Guy', lastName: 'Talla', number: 5, position: 'Défenseur', className: 'SJI 5', teamId: 't6' }
];

const INITIAL_MATCHS: Match[] = [
  // Championnat Inter-Établissements (c1)
  {
    id: 'm1',
    competitionId: 'c1',
    competitionName: 'Championnat Inter-Établissements IUSJ 2026',
    teamAId: 't1',
    teamAName: 'SJI Génie Logiciel FC',
    teamALogoColor: '#38bdf8',
    teamBId: 't2',
    teamBName: 'SJSM Finance Kings',
    teamBLogoColor: '#22c55e',
    scoreA: 3,
    scoreB: 1,
    date: '2026-05-10',
    time: '15:30',
    pitch: 'Stade de l’Ingénieur (Campus SJI)',
    referee: 'M. Jean-Paul Mvogo',
    status: 'Terminé',
    cards: [
      { id: 'card1', playerId: 'p1', playerName: 'Marc Atangana', teamId: 't1', type: 'yellow', minute: 23 },
      { id: 'card2', playerId: 'p6', playerName: 'Christian Talla', teamId: 't2', type: 'yellow', minute: 40 },
      { id: 'card3', playerId: 'p22', playerName: 'Boris Ebanda', teamId: 't2', type: 'red', minute: 75 }
    ],
    goals: [
      { id: 'g1', scorerId: 'p2', scorerName: 'Cédric Fouda', teamId: 't1', minute: 12 },
      { id: 'g2', scorerId: 'p5', scorerName: 'Emmanuel Simo', teamId: 't2', minute: 44 },
      { id: 'g3', scorerId: 'p15', scorerName: 'Samuel Eto', teamId: 't1', minute: 67 },
      { id: 'g4', scorerId: 'p2', scorerName: 'Cédric Fouda', teamId: 't1', minute: 82 }
    ]
  },
  {
    id: 'm2',
    competitionId: 'c1',
    competitionName: 'Championnat Inter-Établissements IUSJ 2026',
    teamAId: 't3',
    teamAName: 'Vogt Lions',
    teamALogoColor: '#6366f1',
    teamBId: 't5',
    teamBName: 'Douala Sharks',
    teamBLogoColor: '#14b8a6',
    scoreA: 2,
    scoreB: 2,
    date: '2026-05-12',
    time: '14:00',
    pitch: 'Terrain A (Campus Vogt)',
    referee: 'Arbitre Fédéral M. Noah',
    status: 'Terminé',
    cards: [
      { id: 'card4', playerId: 'p8', playerName: 'Bertrand Mballa', teamId: 't3', type: 'yellow', minute: 15 }
    ],
    goals: [
      { id: 'g5', scorerId: 'p7', scorerName: 'Arthur Nguene', teamId: 't3', minute: 8 },
      { id: 'g6', scorerId: 'p11', scorerName: 'Olivier Kamdem', teamId: 't5', minute: 31 },
      { id: 'g7', scorerId: 'p26', scorerName: 'Patrick Mboma', teamId: 't3', minute: 58 },
      { id: 'g8', scorerId: 'p12', scorerName: 'Pierre Ngoma', teamId: 't5', minute: 89 }
    ]
  },
  {
    id: 'm3',
    competitionId: 'c1',
    competitionName: 'Championnat Inter-Établissements IUSJ 2026',
    teamAId: 't4',
    teamAName: 'CPGE Titans',
    teamALogoColor: '#ec4899',
    teamBId: 't1',
    teamBName: 'SJI Génie Logiciel FC',
    teamBLogoColor: '#38bdf8',
    scoreA: 0,
    scoreB: 4,
    date: '2026-05-15',
    time: '16:00',
    pitch: 'Stade de l’Ingénieur (Campus SJI)',
    referee: 'M. Jean-Paul Mvogo',
    status: 'Terminé',
    cards: [],
    goals: [
      { id: 'g9', scorerId: 'p2', scorerName: 'Cédric Fouda', teamId: 't1', minute: 14 },
      { id: 'g10', scorerId: 'p1', scorerName: 'Marc Atangana', teamId: 't1', minute: 39 },
      { id: 'g11', scorerId: 'p15', scorerName: 'Samuel Eto', teamId: 't1', minute: 71 },
      { id: 'g12', scorerId: 'p19', scorerName: 'David Nkolo', teamId: 't1', minute: 88 }
    ]
  },
  {
    id: 'm4',
    competitionId: 'c1',
    competitionName: 'Championnat Inter-Établissements IUSJ 2026',
    teamAId: 't2',
    teamAName: 'SJSM Finance Kings',
    teamALogoColor: '#22c55e',
    teamBId: 't3',
    teamBName: 'Vogt Lions',
    teamBLogoColor: '#6366f1',
    scoreA: 1,
    scoreB: 0,
    date: '2026-05-18',
    time: '15:30',
    pitch: 'Terrain A (Campus Vogt)',
    referee: 'M. Jean-Paul Mvogo',
    status: 'Terminé',
    cards: [
      { id: 'card5', playerId: 'p21', playerName: 'Arnaud Foko', teamId: 't2', type: 'yellow', minute: 42 },
      { id: 'card6', playerId: 'p27', playerName: 'Simon Nlend', teamId: 't3', type: 'yellow', minute: 60 }
    ],
    goals: [
      { id: 'g13', scorerId: 'p23', scorerName: 'Francis Ngannou', teamId: 't2', minute: 78 }
    ]
  },
  {
    id: 'm5',
    competitionId: 'c1',
    competitionName: 'Championnat Inter-Établissements IUSJ 2026',
    teamAId: 't5',
    teamAName: 'Douala Sharks',
    teamALogoColor: '#14b8a6',
    teamBId: 't4',
    teamBName: 'CPGE Titans',
    teamBLogoColor: '#ec4899',
    date: '2026-05-22',
    time: '15:30',
    pitch: 'Synthetique de Douala (Campus PSJD)',
    referee: 'Arbitre Littoral M. Soni',
    status: 'Planifié',
    cards: [],
    goals: []
  },
  {
    id: 'm6',
    competitionId: 'c1',
    competitionName: 'Championnat Inter-Établissements IUSJ 2026',
    teamAId: 't1',
    teamAName: 'SJI Génie Logiciel FC',
    teamALogoColor: '#38bdf8',
    teamBId: 't5',
    teamBName: 'Douala Sharks',
    teamBLogoColor: '#14b8a6',
    date: '2026-05-26',
    time: '16:00',
    pitch: 'Stade de l’Ingénieur (Campus SJI)',
    referee: 'M. Jean-Paul Mvogo',
    status: 'Planifié',
    cards: [],
    goals: []
  },
  {
    id: 'm7',
    competitionId: 'c1',
    competitionName: 'Championnat Inter-Établissements IUSJ 2026',
    teamAId: 't3',
    teamAName: 'Vogt Lions',
    teamALogoColor: '#6366f1',
    teamBId: 't4',
    teamBName: 'CPGE Titans',
    teamBLogoColor: '#ec4899',
    date: '2026-05-29',
    time: '14:30',
    pitch: 'Terrain A (Campus Vogt)',
    referee: 'M. Jean-Paul Mvogo',
    status: 'Reporté',
    reportReason: 'Pluie torrentielle sur Yaoundé et indisponibilité du terrain de secours.',
    cards: [],
    goals: []
  }
];

const INITIAL_NOTIFICATIONS: SportNotification[] = [
  {
    id: 'n1',
    title: 'Report de Match - Vogt Lions vs CPGE Titans',
    content: 'Le match prévu le 29 mai est reporté au 2 juin en raison d’un conflit de calendrier et de risques d’intempéries.',
    type: 'schedule',
    date: '2026-05-19T10:00:00Z',
    isRead: false
  },
  {
    id: 'n2',
    title: 'Victoire écrasante de SJI Génie Logiciel !',
    content: 'SJI s’est imposé 4-0 face aux CPGE Titans consolidant sa première place du Championnat IUSJ.',
    type: 'result',
    date: '2026-05-15T18:00:00Z',
    isRead: false
  },
  {
    id: 'n3',
    title: 'Annonce Officielle : Ouverture de la Coupe de l’Ingénieur',
    content: 'La compétition de Basket-ball "Coupe de l’Ingénieur" débutera le 1er Juin. Inscrivez vos équipes !',
    type: 'announcement',
    date: '2026-05-14T08:30:00Z',
    isRead: true
  }
];

const INITIAL_LOGS: ActionLog[] = [
  {
    id: 'l1',
    userId: 'u1',
    userName: 'Jean-Marc Nkou (Admin)',
    action: 'Planification Match',
    details: 'Création du match SJI Génie Logiciel vs Douala Sharks le 26 Mai.',
    timestamp: '2026-05-19T11:45:00Z'
  },
  {
    id: 'l2',
    userId: 'u2',
    userName: 'Aline Zanga (Sport Manager)',
    action: 'Validation Résultat',
    details: 'Saisie et validation du score 1-0 entre SJSM Finance Kings et Vogt Lions.',
    timestamp: '2026-05-18T17:40:00Z'
  },
  {
    id: 'l3',
    userId: 'u1',
    userName: 'Jean-Marc Nkou (Admin)',
    action: 'Mise à jour Equipe',
    details: 'Modification des joueurs de SJSM Finance Kings - Ajout de Francis Ngannou.',
    timestamp: '2026-05-17T09:12:00Z'
  }
];

// Initialize Data Store in localStorage helper
function getStore<T>(key: string, initial: T[]): T[] {
  const data = localStorage.getItem(`iusj_sports_${key}`);
  if (!data) {
    localStorage.setItem(`iusj_sports_${key}`, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
}

function saveStore<T>(key: string, data: T[]) {
  localStorage.setItem(`iusj_sports_${key}`, JSON.stringify(data));
}

// Global functions to read from / write to LocalStorage
export const getMockUsers = () => getStore<User>('users', INITIAL_USERS);
export const getMockCompetitions = () => getStore<Competition>('competitions', INITIAL_COMPETITIONS);
export const getMockTeams = () => getStore<Team>('teams', INITIAL_TEAMS);
export const getMockPlayers = () => getStore<Player>('players', INITIAL_PLAYERS);
export const getMockMatches = () => getStore<Match>('matches', INITIAL_MATCHS);
export const getMockNotifications = () => getStore<SportNotification>('notifications', INITIAL_NOTIFICATIONS);
export const getMockLogs = () => getStore<ActionLog>('logs', INITIAL_LOGS);

// Recalculates standing points automatically for any Competition
export function calculateStandings(competitionId: string): Standing[] {
  const matches = getMockMatches().filter(m => m.competitionId === competitionId && m.status === 'Terminé');
  const teams = getMockTeams();
  
  // Calculate standings maps
  const standingsMap: Record<string, Standing> = {};
  
  // Initialize map
  teams.forEach(team => {
    standingsMap[team.id] = {
      teamId: team.id,
      teamName: team.name,
      etablissement: team.etablissement,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0
    };
  });

  // Calculate based on matches
  matches.forEach(match => {
    const { teamAId, teamBId, scoreA, scoreB } = match;
    if (scoreA === undefined || scoreB === undefined) return;

    const standingA = standingsMap[teamAId];
    const standingB = standingsMap[teamBId];

    if (standingA && standingB) {
      standingA.played += 1;
      standingB.played += 1;
      standingA.goalsFor += scoreA;
      standingA.goalsAgainst += scoreB;
      standingB.goalsFor += scoreB;
      standingB.goalsAgainst += scoreA;

      if (scoreA > scoreB) {
        standingA.won += 1;
        standingA.points += 3;
        standingB.lost += 1;
      } else if (scoreA < scoreB) {
        standingB.won += 1;
        standingB.points += 3;
        standingA.lost += 1;
      } else {
        standingA.drawn += 1;
        standingA.points += 1;
        standingB.drawn += 1;
        standingB.points += 1;
      }
    }
  });

  // Map to array and sort
  return Object.values(standingsMap)
    .map(standing => {
      standing.goalDifference = standing.goalsFor - standing.goalsAgainst;
      return standing;
    })
    // Sort by points desc, then goal difference desc, then goals for desc
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
}

// Recalculates inter-schools standings (Saint Jean Ingénieur, management, Vogt, Douala, CPGE)
export function getInterEcolesStandings(): EtablissementStanding[] {
  const matches = getMockMatches().filter(m => m.status === 'Terminé');
  const teams = getMockTeams();
  const schools: Etablissement[] = [
    'Saint Jean Ingénieur',
    'Saint Jean School of Management',
    'Prépa Vogt',
    'CPGE',
    'Prépa Saint Jean Douala'
  ];

  const standingMap: Record<Etablissement, EtablissementStanding> = {
    'Saint Jean Ingénieur': { etablissement: 'Saint Jean Ingénieur', teamsCount: 0, matchesPlayed: 0, matchesWon: 0, points: 0 },
    'Saint Jean School of Management': { etablissement: 'Saint Jean School of Management', teamsCount: 0, matchesPlayed: 0, matchesWon: 0, points: 0 },
    'Prépa Vogt': { etablissement: 'Prépa Vogt', teamsCount: 0, matchesPlayed: 0, matchesWon: 0, points: 0 },
    'CPGE': { etablissement: 'CPGE', teamsCount: 0, matchesPlayed: 0, matchesWon: 0, points: 0 },
    'Prépa Saint Jean Douala': { etablissement: 'Prépa Saint Jean Douala', teamsCount: 0, matchesPlayed: 0, matchesWon: 0, points: 0 }
  };

  // Assign team count
  teams.forEach(team => {
    if (standingMap[team.etablissement]) {
      standingMap[team.etablissement].teamsCount += 1;
    }
  });

  // Calculate points and wins based on matches
  matches.forEach(match => {
    const { teamAId, teamBId, scoreA, scoreB } = match;
    if (scoreA === undefined || scoreB === undefined) return;
    
    const teamA = teams.find(t => t.id === teamAId);
    const teamB = teams.find(t => t.id === teamBId);

    if (teamA && standingMap[teamA.etablissement]) {
      standingMap[teamA.etablissement].matchesPlayed += 1;
    }
    if (teamB && standingMap[teamB.etablissement]) {
      standingMap[teamB.etablissement].matchesPlayed += 1;
    }

    if (scoreA > scoreB) {
      if (teamA) {
        standingMap[teamA.etablissement].matchesWon += 1;
        standingMap[teamA.etablissement].points += 3;
      }
    } else if (scoreA < scoreB) {
      if (teamB) {
        standingMap[teamB.etablissement].matchesWon += 1;
        standingMap[teamB.etablissement].points += 3;
      }
    } else {
      // Draw
      if (teamA) standingMap[teamA.etablissement].points += 1;
      if (teamB) standingMap[teamB.etablissement].points += 1;
    }
  });

  return Object.values(standingMap).sort((a, b) => b.points - a.points);
}

// Log actions
export function logAction(userId: string, userName: string, action: string, details: string) {
  const logs = getMockLogs();
  const newLog: ActionLog = {
    id: `log-${Date.now()}`,
    userId,
    userName,
    action,
    details,
    timestamp: new Date().toISOString()
  };
  saveStore('logs', [newLog, ...logs]);
}

// Simulate API wrapper helper with delays for a real modern look
export function apiSimulate<T>(data: T, delayMs: number = 400): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delayMs);
  });
}
