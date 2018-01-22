import { Component, Inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  openEditor: boolean = false;
  userEdit: User;

  constructor(@Inject('userService') public userService: UserService) { }

  trackByUsers(index: number, user: User): string { return user.id; }

  add(name: string) {
    const user = new User(name);
    this.userService.add(user);
  }

  edit(user: User): void{
    this.openEditor = true;
    this.userEdit = user;
  }

  update() {
    let that = this;
    this.userService.update(this.userEdit).subscribe(
        function (x) { console.log('onNext: ' + x); },
        function (e) { console.log('onError: ' + e.message); },
        function () { that.openEditor  = false; }
    );
  }

  cancel():void{
    this.openEditor = false;
  }

  search(term: string) {

  }

}
