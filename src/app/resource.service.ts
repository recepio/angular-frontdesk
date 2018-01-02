import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CollectionService } from './collection.service';
import { MessageService } from './message.service';
import { Resource } from './resource';
import { EventService} from './event.service';

@Injectable()
export class ResourceService extends CollectionService<Resource> {

  constructor(
    protected http: HttpClient,
    protected messageService: MessageService,
    @Inject('eventService') private eventService: EventService
  ) {
    super('resources', http, messageService);
    this.get()
      .subscribe(items => {
        items.forEach(resource => {
          resource.events = this.eventService.items.filter(event => event['resource_ids'].includes(resource.id));
        });
        this.items = items;
      });
  }

}
