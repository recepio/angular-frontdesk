import { Item } from './item';

export class Event extends Item {
  users: string[];
  public date: Date;

  constructor(public resource: string, public dateFrom: Date,
              public dateTo: Date, public duration: number,
              public startFrom: Date, public end: Date,
              public id: number,
  ) {
    super();
  }

}
