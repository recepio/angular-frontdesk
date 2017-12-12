import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Resource } from './resource';
import { MessageService } from './message.service';
import { CollectionService } from './collection.service';

@Injectable()
export class ResourceService extends CollectionService {

  constructor(protected http: HttpClient,
              protected messageService: MessageService) {
    super(http, messageService);
    this.name = 'resources';
    this.get<Resource>()
      .subscribe(items => this.items = items);
  }
}
