import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { CollectionService } from './collection.service';
import { MessageService } from './message.service';
import { Area } from './area';
import { HoodieService } from './hoodie.service';
import { ResourceService } from './resource.service';

@Injectable()
export class AreaService extends CollectionService<Area> {

  constructor(
    protected hoodieService: HoodieService,
    protected messageService: MessageService,
    @Inject('resourceService') public resourceService: ResourceService
  ) {
    super('area', hoodieService, messageService);
  }

  remove(area: Area): Observable<Area> {
    const filter = item => item.type === 'resource' && item.area === area._id;
    this.hoodieService.fetch(filter).then(items => {
      console.log('resources loaded', items);
      items.forEach(item => {
        this.resourceService.remove(item);
      });
    });
    return super.remove(area);
  }

}
