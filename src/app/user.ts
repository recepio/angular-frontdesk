import { UUID } from 'angular2-uuid';

export class User {

  id: string;
  email: string;
  type?: string;
  phoneNumber?: string;
  citizenship?: string;

  constructor(
    public name: string
  ) {
    this.id = UUID.UUID();
  }

}
