import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './user';
import { MessageService } from './message.service';
import { CollectionService } from './collection.service';

@Injectable()
export class UserService extends CollectionService {

  constructor(protected http: HttpClient, protected messageService: MessageService) {
    super(http, messageService);
    this.name = 'users';
    this.get<User>()
      .subscribe(items => this.items = items);
  }

}
