import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import 'rxjs/add/observable/fromPromise';

import { Item } from './item';
import { MessageService } from './message.service';
import { HoodieService } from './hoodie.service';

export abstract class CollectionService<T extends Item> {

  constructor(protected type: string, protected hoodieService: HoodieService, protected messageService: MessageService) { }

  add(item: T): Observable<T> {
    return Observable.fromPromise(this.hoodieService.add(this.type, item)).pipe(
      tap(() => this.log(`added ${this.type} w/ id=${item._id}`)),
      catchError(this.handleError(`add(${this.type})`))
    );
  }

  update(item: T): Observable<any> {
    console.log('update', item);
    return Observable.fromPromise(this.hoodieService.update(item))
      .pipe(
        tap(() => this.log(`updated ${this.type} id=${item._id}`)),
        catchError(this.handleError(`update(${this.type})`))
      );
  }

  remove(item: T): Observable<T> {
    return Observable.fromPromise(this.hoodieService.remove(item))
      .pipe(
        tap(() => this.log(`deleted ${this.type} id=${item._id}`)),
        catchError(this.handleError(`delete(${this.type})`))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError(operation = 'operation', result?: T) {
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
    this.messageService.add(`(${this.type})Service: ${message}`);
  }

}
