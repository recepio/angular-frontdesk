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
    this.userService.update(this.userEdit).
    pipe(
        tap(_ =>{
            this.openEditor = false;}))
  }

  cancel():void{
    this.openEditor = false;
  }

  search(term: string) {

  }

}
