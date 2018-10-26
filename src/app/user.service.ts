import { Injectable } from '@angular/core';

import { CollectionService } from './collection.service';
import { MessageService } from './message.service';
import { User } from './user';
import { HoodieService } from './hoodie.service';

@Injectable()
export class UserService extends CollectionService<User> {

  constructor(
    protected hoodieService: HoodieService,
    protected messageService: MessageService
  ) {
    super('user', hoodieService, messageService);
  }

  /*search(term: string): Observable<User[]> {
    if (!term.trim()) {
      return of(this.items);
    }
    return of(this.items.filter(user => user.name.indexOf(term) > -1)).pipe(
      tap(_ => console.log(`found users matching "${term}"`, _)),
      catchError(this.handleError<User[]>('searchUsers', []))
    );
  }*/

}
