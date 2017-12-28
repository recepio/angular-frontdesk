import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CollectionService } from './collection.service';
import { MessageService } from './message.service';
import { Resource } from './resource';

@Injectable()
export class ResourceService extends CollectionService<Resource> {

  constructor(protected http: HttpClient, protected messageService: MessageService) {
    super('resources', http, messageService);
    this.get()
      .subscribe((items: Resource[]) => this.items = items);
  }

}
