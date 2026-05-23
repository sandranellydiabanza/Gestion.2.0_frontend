import { Routes } from '@angular/router';
import {Login } from './views/auth/login/login'
import {Navbar } from './components/navbar/navbar'
import {  Sidebar} from './components/sidebar/sidebar'
import { Toast} from './components/toast/toast'
import { AuditLogs} from './views/audit-logs/audit-logs'
import {Dashboard} from './views/dashboard/dashboard'
import {Matches } from './views/matches/matches'
import {Notifications} from './views/notification/notification'
import {Players} from './views/players/players'
import {Profile } from './views/profile/profile'
import {Competitions } from './views/competitions/competitions'
import {Rankings } from './views/rankings/rankings'
import {Teams } from './views/teams/teams'
export const routes: Routes = [{
    path: '',
    component:Dashboard  },{
    path: 'navbar',
    component:Navbar  },
    {
    path: 'sidebar',
    component: Sidebar  },
     {
    path: 'toast',
    component: Toast  },
   {
    path: 'auditlogs',
    component: AuditLogs },
   
    {
    path: 'matches',
    component: Matches },
     {
    path: 'players',
    component: Players },
     {
    path: 'profile',
    component: Profile },
    {
    path: 'competition',
    component: Competitions },
    {
    path: 'rankings',
    component: Rankings },
    {
    path: 'team', 
    component: Teams },
     {
    path: 'notifications', 
    component: Notifications },
  
   
    ];
