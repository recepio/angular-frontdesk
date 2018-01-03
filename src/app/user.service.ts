import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { CollectionService } from './collection.service';
import { MessageService } from './message.service';
import { User } from './user';
import { IndexedDbService } from './indexed-db.service';

@Injectable()
export class UserService extends CollectionService<User> {

  constructor(
    protected http: HttpClient,
    protected messageService: MessageService,
    private indexedDbService: IndexedDbService) {
    super('users', http, messageService);
    this.get()
      .subscribe(items => this.items = items);
  }

  createKey(): string {
    return uuid();
  }

  get(): Observable<User[]> {
    return Observable.fromPromise(this.indexedDbService.db.getAll('users'));
  }

  add(user: User): Observable<User> {
    this.items.push(user);
    return Observable.fromPromise(this.indexedDbService.db.add('users', user));
  }

  search(term: string): Observable<User[]> {
    if (!term.trim()) {
      return of(this.items);
    }
    return of(this.items.filter(user => user.name.indexOf(term) > -1)).pipe(
      tap(_ => console.log(`found users matching "${term}"`, _)),
      catchError(this.handleError<User[]>('searchUsers', []))
    );
  }

  delete (user: User): Observable<User> {
    this.items = this.items.filter(h => h.id !== user.id);

    return Observable.fromPromise(this.indexedDbService.db.delete('users', user.id)).pipe(
      tap(_ => this.log(`deleted user id=${user.id}`)),
      catchError(this.handleError<User>(`deleteUser`))
    );
  }

}
