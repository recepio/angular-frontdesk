import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CollectionService } from './collection.service';
import { MessageService } from './message.service';
import { User } from './user';

@Injectable()
export class UserService extends CollectionService<User> {

  constructor(protected http: HttpClient, protected messageService: MessageService) {
    super('users', http, messageService);
    this.get()
      .subscribe((items: User[]) => this.items = items);
  }

}
