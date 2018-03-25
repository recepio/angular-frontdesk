import { Item } from './item';

export class User extends Item {
  email: string;
  type: string;
  phoneNumber: string;
  citizenship: string;

  constructor(public name: string) {
    super();
  }

}
