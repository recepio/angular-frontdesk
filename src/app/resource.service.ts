import {Inject, Injectable} from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { CollectionService } from './collection.service';
import { MessageService } from './message.service';
import { Resource } from './resource';
import { EventService } from './event.service';
import { HoodieService } from './hoodie.service';

@Injectable()
export class ResourceService extends CollectionService<Resource> {

  constructor(
    protected hoodieService: HoodieService,
    protected messageService: MessageService,
    @Inject('eventService') private eventService: EventService
  ) {
    super('resource', hoodieService, messageService);
  }

  remove(resource: Resource): Observable<Resource> {
    const filter = item => item.type === 'event' && item.resource === resource._id;
    this.hoodieService.fetch(filter).then(items => {
      console.log('events loaded', items);
      items.forEach(item => {
        this.eventService.remove(item);
      });
    });
    return super.remove(resource);
  }

}
