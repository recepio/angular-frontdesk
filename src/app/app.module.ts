import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DndModule } from 'ng2-dnd';

import { AppRoutingModule } from './app-routing.module';
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

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    DndModule.forRoot()
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
    TimeTableComponent
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
