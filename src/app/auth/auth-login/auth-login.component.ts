import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { User } from '../../models/user';
import { AppState } from '../../store/reducers/auth.reducers';
import { Login } from '../../store/actions/auth.actions';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {

  user: User = new User();

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }

  onSubmit(): void {
      console.log(this.user);
      const payload = {
            email: this.user.email,
            password: this.user.password
      };
      this.store.dispatch(new Login(payload));
    }
}
