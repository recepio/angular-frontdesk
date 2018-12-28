import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';


import { DndModule } from 'ng2-dnd';

import { AppRoutingModule } from './app-routing.module';
import { AuthEffects } from './store/effects/auth.effects';
import { reducers } from './store/reducers/auth.reducers';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventsComponent } from './events/events.component';
import { EventSearchComponent } from './event-search/event-search.component';
import { EventService } from './event.service';
import { MessageService } from './message.service';
import { ResourceService } from './resource.service';
import { MessagesComponent } from './messages/messages.component';
import { EventItemComponent } from './event-item/event-item.component';
import { SelectionService } from './selection.service';
import { ResourcesComponent } from './resources/resources.component';
import { ResourceItemComponent } from './resource-item/resource-item.component';
import { TimeEventsComponent } from './time-events/time-events.component';
import { TimelineService } from './timeline.service';
import { TimelineComponent } from './timeline/timeline.component';
import { FillPipe } from './fill.pipe';
import { UserFormComponent } from './user-form/user-form.component';
import { UserService } from './user.service';
import { SelectableDirective } from './selectable.directive';
import { UserItemComponent } from './user-item/user-item.component';
import { AreaService } from './area.service';
import { UsersComponent } from './users/users.component';
import { MatchesUserPipe } from './matches-user.pipe';
import { AreaFormComponent } from './area-form/area-form.component';
import { AreaItemComponent } from './area-item/area-item.component';
import { AutofocusDirective } from './autofocus.directive';
import { AreasComponent } from './areas/areas.component';
import { HoodieService } from './hoodie.service';
import { TimeTableComponent } from './time-table/time-table.component';
import { AuthLoginComponent } from './auth/auth-login/auth-login.component';
import { AuthCompanyEmailComponent } from './auth/auth-company-email/auth-company-email.component';
import { AuthCompanyComponent } from './auth/auth-company/auth-company.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    DndModule.forRoot(),
    StoreModule.forRoot(reducers, {}),
    EffectsModule.forRoot([AuthEffects]),
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    EventsComponent,
    EventDetailComponent,
    MessagesComponent,
    EventSearchComponent,
    EventItemComponent,
    ResourcesComponent,
    ResourceItemComponent,
    TimeEventsComponent,
    TimelineComponent,
    FillPipe,
    UserFormComponent,
    SelectableDirective,
    UserItemComponent,
    UsersComponent,
    MatchesUserPipe,
    AreaFormComponent,
    AreaItemComponent,
    AutofocusDirective,
    AreasComponent,
    TimeTableComponent,
    AuthLoginComponent,
    AuthCompanyEmailComponent,
    AuthCompanyComponent
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: 'areaService', useClass: AreaService },
    { provide: 'eventService', useClass: EventService },
    { provide: 'resourceService', useClass: ResourceService },
    { provide: 'userService', useClass: UserService },
    { provide: 'areaSelectionService', useClass: SelectionService },
    { provide: 'userSelectionService', useClass: SelectionService },
    { provide: 'resourceSelectionService', useClass: SelectionService },
    { provide: 'eventSelectionService', useClass: SelectionService },
      MessageService,
    TimelineService,
    HoodieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
