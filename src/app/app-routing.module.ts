import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { AuthLoginComponent } from './auth/auth-login/auth-login.component';
import { AuthCompanyEmailComponent } from './auth/auth-company-email/auth-company-email.component';
import { AuthCompanyComponent } from './auth/auth-company/auth-company.component';

const routes: Routes = [
  { path: '', component: AuthLoginComponent  },
  { path: 'login', component: AuthLoginComponent },
  { path: 'company/add', component: AuthCompanyComponent},
  { path: 'company/add/user', component: AuthCompanyEmailComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: EventDetailComponent },
  { path: 'events', component: EventsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
