import { UUID } from 'angular2-uuid';

import { Resource } from './resource';
import { AreaService } from './area.service';

export class Area {

  id: string;
  order: number;
  name: string;
  resources: Resource[];

  constructor(areaService: AreaService) {
    this.id = UUID.UUID();
    this.order = areaService.items.length;
    let newName: string;
    let i = 0;
    do {
      i++;
      newName = `Area${i}`;
    } while (areaService.items.find(area => area.name === newName));
    this.name = newName;
  }

}
