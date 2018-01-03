import { Inject, Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {catchError, map, tap} from 'rxjs/operators';

import { CollectionService } from './collection.service';
import { MessageService } from './message.service';
import { Event } from './event';
import { UserService } from './user.service';
import { ResourceService } from './resource.service';

@Injectable()
export class EventService extends CollectionService<Event> {

  constructor(
    protected http: HttpClient,
    protected messageService: MessageService,
    @Inject('userService') private userService: UserService,
    private injector: Injector
  ) {
    super('events', http, messageService);
    this.get()
      .subscribe(items => {
        items.forEach(event => {
          event.date = new Date(event.date);
          event.users = this.userService.items.filter(user => event['user_ids'].includes(user.id));
        });
        this.items = items;
      });
  }

  delete (event: Event | number): Observable<Event> {
    const resourceService: ResourceService = this.injector.get('resourceService');

    resourceService.items.forEach(resource => {
      resource.events = resource.events.filter(e => e !== event);
    });

    return super.delete(event);
  }

  /** GET event by id. Return `undefined` when id not found */
  /* getEventNo404<Data>(id: number): Observable<Event> {
    const url = `${this.eventsUrl}/?id=${id}`;
    return this.http.get<Event[]>(url)
      .pipe(
        map(events => events[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} event id=${id}`);
        }),
        catchError(this.handleError<Event>(`getEvent id=${id}`))
      );
  }

  /* GET events whose name contains search term */
  search(term: string): Observable<Event[]> {
    if (!term.trim()) {
      // if not search term, return empty event array.
      return of([]);
    }
    return this.http.get<Event[]>(`api/events/?date=${term}`).pipe(
      tap(_ => this.log(`found events matching "${term}"`)),
      map(events => {
        events.map(event => event.users = this.userService.items.filter(user => event['user_ids'].includes(user.id)));
        return events;
      }),
      catchError(this.handleError<Event[]>('searchEvents', []))
    );
  }

  /*updateEvent (event: Event): Observable<any> {
    return this.http.put(this.eventsUrl, event, httpOptions).pipe(
      tap(_ => this.log(`updated event id=${event.id}`)),
      catchError(this.handleError<any>('updateEvent'))
    );
  } */

}
