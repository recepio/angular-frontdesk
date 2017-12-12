import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Item } from './item';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export class CollectionService {
  items: Item[] = [];
  protected name: string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService) {
  }

  get<T> (): Observable<T[]> {
    return this.http.get<T[]>(`api/${this.name}`)
      .pipe(
        tap(items => this.log(`fetched ${this.name}`)),
        catchError(this.handleError(`get(${this.name})`, []))
      );
  }

  delete (item: Item | number): Observable<Item> {
    const id = typeof item === 'number' ? item : item.id;
    const url = `api/${this.name}/${id}`;

    this.items = this.items.filter(h => h !== item);

    return this.http.delete<Item>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted ${this.name} id=${id}`)),
      catchError(this.handleError<Item>(`delete(${this.name})`))
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
