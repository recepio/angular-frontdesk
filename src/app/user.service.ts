import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { CollectionService } from './collection.service';
import { MessageService } from './message.service';
import { User } from './user';
import { IndexedDbService } from './indexed-db.service';

@Injectable()
export class UserService extends CollectionService<User> {

  constructor(
    protected indexedDbService: IndexedDbService,
    protected messageService: MessageService
  ) {
    super('users', indexedDbService, messageService);
    this.get()
      .subscribe(items => this.items = items);
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

}
