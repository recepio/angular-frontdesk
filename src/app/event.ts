import { Item } from './item';
import { User } from './user';

export class Event extends Item {
  users: User[];
  date: Date;
  duration: any;
}
