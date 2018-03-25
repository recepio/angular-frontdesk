import { Item } from './item';

export class Event extends Item {
  users: string[];

  constructor(public resource: string, public date: Date, public duration: number) {
    super();
  }

}
