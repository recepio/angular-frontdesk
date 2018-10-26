import { Component, HostListener, Inject, Input, OnInit } from '@angular/core';

import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit {

  @Input() user: User;

  @HostListener('dragstart', ['$event']) onDragStart(evt: Event | any) {
    console.log('dragstart', this.user._id);
    const offsetX = evt.offsetX;
    const offsetY = evt.offsetY;
    const data = {
      id: this.user._id,
      x: offsetX,
      y: offsetY
    };
    try {
      evt.dataTransfer.setData('application/x-recepio-frontdesk.user', JSON.stringify(data));
    } catch (e) {
      // IE 11
    }
    evt.dataTransfer.setData('text', `user ${this.user._id} ${offsetX} ${offsetY}`);

    evt.dataTransfer.effectAllowed = 'move';
  }

  constructor(
    @Inject('userService') public userService: UserService
  ) { }

  ngOnInit() {
  }

  remove(user: User): void {
    this.userService.remove(user);
  }

}
