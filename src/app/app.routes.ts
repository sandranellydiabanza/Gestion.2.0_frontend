import { Routes } from '@angular/router';
import {Login } from './views/auth/login/login'
import {Navbar } from './components/navbar/navbar'
import {  Sidebar} from './components/sidebar/sidebar'
import { Toast} from './components/toast/toast'

export const routes: Routes = [{
    path: '',
    component:Login  },{
    path: 'navbar',
    component:Navbar  },
    {
    path: 'sidebar',
    component: Sidebar  },
     {
    path: 'toast',
    component: Toast  },
   
  
   
    ];
