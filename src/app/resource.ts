import { Item } from './item';
import { Event } from './event';

export class Resource extends Item {
  name: string;
  events: Event[];
}
