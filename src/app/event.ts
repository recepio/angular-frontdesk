import { Item } from './item';

export class Event extends Item {
  name: string;
  date: Date;
  duration: any;
  resource: number;
}
