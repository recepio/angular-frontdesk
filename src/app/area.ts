import { Item } from './item';

export class Area extends Item {
  serviceName: string;
  description: string;

  constructor(public name: string, public order: number) {
    super();
  }

}
