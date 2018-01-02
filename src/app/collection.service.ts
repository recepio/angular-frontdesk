import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Item } from './item';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export abstract class CollectionService<T extends Item> {

  items: T[] = [];

  constructor(private name: string, protected http: HttpClient, protected messageService: MessageService) { }

  get (): Observable<T[]> {
    return this.http.get<T[]>(`api/${this.name}`)
      .pipe(
        tap(items => this.log(`fetched ${this.name}`)),
        catchError(this.handleError(`get(${this.name})`, []))
      );
  }

  getItem (id: number): Observable<T> {
    const url = `api/${this.name}/${id}`;
    return this.http.get<T>(url).pipe(
      tap(_ => this.log(`fetched ${this.name} id=${id}`)),
      catchError(this.handleError<T>(`get(${this.name}) id=${id}`))
    );
  }

  add (item: T): Observable<T> {
    this.items.push(item);

    return this.http.post<T>(`api/${this.name}`, item, httpOptions).pipe(
      tap((item: T) => this.log(`added ${this.name} w/ id=${item.id}`)),
      catchError(this.handleError<T>(`add(${this.name})`))
    );
  }

  delete (item: T | number): Observable<T> {
    const id = typeof item === 'number' ? item : item.id;
    const url = `api/${this.name}/${id}`;

    this.items = this.items.filter(h => h.id !== id);

    return this.http.delete<T>(url, httpOptions).pipe(
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
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`(${this.name})Service: ${message}`);
  }
}
