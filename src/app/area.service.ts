import { Inject, Injectable } from '@angular/core';

import { IndexDetails } from 'angular2-indexeddb';

import { CollectionService } from './collection.service';
import { MessageService } from './message.service';
import { Area } from './area';
import { SelectionService } from './selection.service';
import { ResourceService } from './resource.service';
import { IndexedDbService } from './indexed-db.service';

@Injectable()
export class AreaService extends CollectionService<Area> {

  constructor(
    protected indexedDbService: IndexedDbService,
    protected messageService: MessageService,
    @Inject('areaSelectionService') private areaSelectionService: SelectionService,
    @Inject('resourceService') public resourceService: ResourceService
  ) {
    super('areas', indexedDbService, messageService);
    this.get(<IndexDetails>{ indexName: 'order' })
      .subscribe(items => {
        items.forEach(area => {
          area.resources = this.resourceService.items.filter(resource => resource['area_id'] === area.id);
        });
        this.items = items;
        if (this.items.length) {
          this.areaSelectionService.select(this.items[0]);
        }
      });
  }

}
