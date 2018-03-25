import { Component, Inject, HostListener, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { User } from '../user';
import { UserService } from '../user.service';
import { HoodieService } from '../hoodie.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];

  openEditor = false;
  userEdit: User;
  yCoordinates: number;

  private changeSubscription: Subscription;

  @HostListener('dblclick', ['$event']) onDblClick(evt: MouseEvent) {
    this.yCoordinates = evt.pageY;
    console.log(this.yCoordinates);
  }

  constructor(
    @Inject('userService') private userService: UserService,
    private hoodieService: HoodieService
  ) { }

  trackByUsers(index: number, user: User): string { return user._id; }

  ngOnInit() {
    this.load();
  }

  private load() {
    const filter = item => item.type === 'user';
    this.users = [];
    this.hoodieService.fetch(filter).then(items => {
      this.users = items;
      console.log('users loaded', items);

      this.changeSubscription = this.hoodieService.changed$.subscribe(({ eventName, object }) => {
        if (!filter(object)) {
          return;
        }
        console.log('user', eventName, object);
        if (eventName === 'add') {
          this.users.push(object);
        } else {
          const index = this.users.findIndex(item => item._id === object._id);
          if (eventName === 'update') {
            Object.assign(this.users[index], object);
          } else if (eventName === 'remove') {
            this.users.splice(index, 1);
          }
        }
      });
    });
  }

  add(name: string) {
    const user = new User(name);
    this.userService.add(user);
  }

  edit(user: User) {
    this.userEdit = user;
    this.openEditor = true;
  }

  update() {
    this.userService.update(this.userEdit);
    this.openEditor = false;
  }

  cancel() {
    this.openEditor = false;
  }

  search(term: string) {

  }

  ngOnDestroy() {
    console.log('users destroy');
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
      console.log('users unsubscribed');
    }
  }

}
