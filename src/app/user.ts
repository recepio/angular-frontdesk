import { v4 as uuid } from 'uuid';

export class User {

  id: string;
  email?: string;
  color?: string;

  constructor(
    public name: string
  ) {
    this.id = uuid();
  }

}
