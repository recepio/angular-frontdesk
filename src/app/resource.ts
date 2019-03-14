import { Item } from './item';
import {Event} from './event';

export class Resource extends Item {

  constructor(public area: string, public name: string, public order: number, public details: Event[]) {
    super();
  }

}
