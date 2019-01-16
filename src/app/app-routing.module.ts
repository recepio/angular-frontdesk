import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { AuthLoginComponent } from './auth/auth-login/auth-login.component';
import { AuthCompanyEmailComponent } from './auth/auth-company-email/auth-company-email.component';
import { AuthCompanyComponent } from './auth/auth-company/auth-company.component';
import {AuthSignUpComponent} from './auth/auth-sign-up/auth-sign-up.component';
import {AuthGuardService} from './services/auth-guard.service';

const routes: Routes = [
  { path: '', component: AuthLoginComponent  },
  { path: 'signup', component: AuthSignUpComponent },
  { path: 'login', component: AuthLoginComponent },
  { path: 'company/add', component: AuthCompanyComponent, canActivate: [AuthGuardService]},
  { path: 'company/add/user', component: AuthCompanyEmailComponent, canActivate: [AuthGuardService] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'detail/:id', component: EventDetailComponent, canActivate: [AuthGuardService] },
  { path: ':workspaceId/events', component: EventsComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
