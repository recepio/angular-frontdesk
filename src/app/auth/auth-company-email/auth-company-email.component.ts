import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState, selectAuthState} from '../../store';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-auth-company-email',
  templateUrl: './auth-company-email.component.html',
  styleUrls: ['./auth-company-email.component.scss']
})
export class AuthCompanyEmailComponent implements OnInit {
  companyForm: FormGroup;
  usernameCtrl: FormControl;
  getState: Observable<any>;
  workspace = null;

  constructor(private store: Store<AppState>, fb: FormBuilder) {
      this.getState = this.store.select(selectAuthState);
      this.usernameCtrl = fb.control('', Validators.required);
  }

  ngOnInit() {
      this.getState.subscribe((state) => {
        console.log(state);
        this.workspace = state.workspace;
      });
  }

}
