import { v4 as uuid } from 'uuid';

export class User {

  id: string;
  email: string;
  type: string;
  phoneNumber: string;
  citizenship: string;

  constructor(public name: string) {
    this.id = uuid();
  }

}
