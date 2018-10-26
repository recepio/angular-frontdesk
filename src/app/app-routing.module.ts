import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: EventsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: EventDetailComponent },
  { path: 'events', component: EventsComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
