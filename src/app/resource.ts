import { Item } from './item';

export class Resource extends Item {

  constructor(public area: string, public name: string, public order: number) {
    super();
  }

}
