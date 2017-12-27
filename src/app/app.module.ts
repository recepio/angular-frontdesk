import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

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
import { MatchesResourcePipe } from './matches-resource.pipe';
import { UserFormComponent } from './user-form/user-form.component';
import { UserService } from './user.service';
import { SelectableDirective } from './selectable.directive';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
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
    MatchesResourcePipe,
    UserFormComponent,
    SelectableDirective
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    MessageService,
    TimelineService,
    { provide: 'eventService', useClass: EventService },
    { provide: 'resourceService', useClass: ResourceService },
    { provide: 'userService', useClass: UserService },
    { provide: 'userSelectionService', useClass: SelectionService },
    { provide: 'resourceSelectionService', useClass: SelectionService },
    { provide: 'eventSelectionService', useClass: SelectionService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
