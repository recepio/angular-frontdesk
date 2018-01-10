import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import { IndexDetails } from 'angular2-indexeddb';

import { Item } from './item';
import { MessageService } from './message.service';
import { IndexedDbService } from './indexed-db.service';

export abstract class CollectionService<T extends Item> {

  items: T[] = [];

  constructor(private name: string, protected indexedDbService: IndexedDbService, protected messageService: MessageService) { }

  get (indexDetails?: IndexDetails): Observable<T[]> {
    return Observable.fromPromise(this.indexedDbService.db.getAll(this.name, null, indexDetails))
      .pipe(
        tap(_ => this.log(`fetched ${this.name}`)),
        catchError(this.handleError(`get(${this.name})`, []))
      );
  }

  /*getItem (id: number): Observable<T> {
    const url = `api/${this.name}/${id}`;
    return this.http.get<T>(url).pipe(
      tap(_ => this.log(`fetched ${this.name} id=${id}`)),
      catchError(this.handleError<T>(`get(${this.name}) id=${id}`))
    );
  }*/

  add (item: T): Observable<T> {
    this.items.push(item);

    return Observable.fromPromise(this.indexedDbService.db.add(this.name, item))
      .pipe(
        tap(_ => this.log(`added ${this.name} w/ id=${item.id}`)),
        catchError(this.handleError<T>(`add(${this.name})`))
      );
  }

  update (item: T): Observable<any> {
    return Observable.fromPromise(this.indexedDbService.db.update(this.name, item))
      .pipe(
        tap(_ => this.log(`updated ${this.name} id=${item.id}`)),
        catchError(this.handleError<any>(`update(${this.name})`))
      );
  }

  delete (item: T | string): Observable<T> {
    const id = typeof item === 'string' ? item : item.id;

    this.items = this.items.filter(h => h.id !== id);

    return Observable.fromPromise(this.indexedDbService.db.delete(this.name, id))
      .pipe(
        tap(_ => this.log(`deleted ${this.name} id=${id}`)),
        catchError(this.handleError<T>(`delete(${this.name})`))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  protected log(message: string) {
    this.messageService.add(`(${this.name})Service: ${message}`);
  }
}
