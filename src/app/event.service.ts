import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Event } from './event';
import { MessageService } from './message.service';
import { CollectionService } from './collection.service';

@Injectable()
export class EventService extends CollectionService {

  constructor(protected http: HttpClient,
              protected messageService: MessageService) {
    super(http, messageService);
    this.name = 'events';
    this.get<Event>()
      .subscribe(items => this.items = items);
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

  getEvent(id: number): Observable<Event> {
    const url = `${this.eventsUrl}/${id}`;
    return this.http.get<Event>(url).pipe(
      tap(_ => this.log(`fetched event id=${id}`)),
      catchError(this.handleError<Event>(`getEvent id=${id}`))
    );
  } */

  /* GET events whose name contains search term */
  /* searchEvents(term: string): Observable<Event[]> {
    if (!term.trim()) {
      // if not search term, return empty event array.
      return of([]);
    }
    return this.http.get<Event[]>(`api/events/?name=${term}`).pipe(
      tap(_ => this.log(`found events matching "${term}"`)),
      catchError(this.handleError<Event[]>('searchEvents', []))
    );
  }

  addEvent (event: Event): Observable<Event> {
    this.events.push(event);

    return this.http.post<Event>(this.eventsUrl, event, httpOptions).pipe(
      tap((event: Event) => this.log(`added event w/ id=${event.id}`)),
      catchError(this.handleError<Event>('addEvent'))
    );
  }

  updateEvent (event: Event): Observable<any> {
    return this.http.put(this.eventsUrl, event, httpOptions).pipe(
      tap(_ => this.log(`updated event id=${event.id}`)),
      catchError(this.handleError<any>('updateEvent'))
    );
  } */
}
