import { Component, Inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  private searchTerms = new Subject<string>();

  constructor(@Inject('userService') public userService: UserService) { }

  ngOnInit() {
    this.users$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.userService.search(term))
    );
    setTimeout(() => this.searchTerms.next(''), 0);
  }

  trackByUsers(index: number, user: User): string { return user.id; }

  add(name: string): void {
    this.userService.add({ id: this.userService.createKey(), name });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

}
