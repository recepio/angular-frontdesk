import {Component, Inject} from '@angular/core';

import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {

  powers = ['Really Smart', 'Super Flexible',
    'Super Hot', 'Weather Changer'];

  model = new User(18, 'Dr IQ', this.powers[0], 'red');

  submitted = false;

  constructor(@Inject('userService') public userService: UserService) { }

  onSubmit() {
    this.submitted = true;
    /*this.userService.add(this.model as User).subscribe();*/
  }

  newUser() {
    this.model = new User(42, '', '');
  }
}
