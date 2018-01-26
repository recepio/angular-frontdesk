import { Component, Inject, HostListener } from '@angular/core';

import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  openEditor = false;
  userEdit: User;
  yCoordinates: number;

  @HostListener('dblclick', ['$event']) onDblClick(evt: MouseEvent) {
    this.yCoordinates = evt.pageY;
    console.log(this.yCoordinates);
  }

  constructor(@Inject('userService') public userService: UserService) { }

  trackByUsers(index: number, user: User): string { return user.id; }

  add(name: string) {
    const user = new User(name);
    this.userService.add(user);
  }

  edit(user: User) {
    this.userEdit = user;
    this.openEditor = true;
  }

  update() {
    let that = this;
    this.userService.update(this.userEdit).subscribe(
        function (x) { console.log('onNext: ' + x); },
        function (e) { console.log('onError: ' + e.message); },
        function () { that.openEditor  = false; }
    );
  }

  cancel() {
    this.openEditor = false;
  }

  search(term: string) {

  }

}
