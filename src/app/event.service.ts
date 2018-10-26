import { Injectable } from '@angular/core';

import { CollectionService } from './collection.service';
import { MessageService } from './message.service';
import { Event } from './event';
import { HoodieService } from './hoodie.service';

@Injectable()
export class EventService extends CollectionService<Event> {

  static associate(event: Event) {
    event.date = new Date(event.date);
  }

  constructor(
    protected hoodieService: HoodieService,
    protected messageService: MessageService
  ) {
    super('event', hoodieService, messageService);
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
  /*search(term: string): Observable<Event[]> {
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
  }*/

}
