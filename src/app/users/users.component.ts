import { Component, Inject } from '@angular/core';

import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  constructor(@Inject('userService') public userService: UserService) { }

  trackByUsers(index: number, user: User): string { return user.id; }

  add(name: string) {
    const user = new User(name);
    this.userService.add(user);
  }

  search(term: string) {

  }

}
