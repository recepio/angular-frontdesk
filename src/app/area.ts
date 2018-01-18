import { v4 as uuid } from 'uuid';

import { Resource } from './resource';
import { AreaService } from './area.service';

export class Area {

  id: string;
  order: number;
  name: string;
  resources: Resource[];
  serviceName: string;
  description: string;

  constructor(areaService: AreaService) {
    this.id = uuid();
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
