import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Login} from '../../store/actions/auth.login.actions';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {CreateWorkspace} from '../../store/actions/workspace.actions';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth-company',
  templateUrl: './auth-company.component.html',
  styleUrls: ['./auth-company.component.scss']
})
export class AuthCompanyComponent implements OnInit {

  companyForm: FormGroup;
  nameCtrl: FormControl;
  descriptionCtrl: FormControl;
  locationCtrl: FormControl;

  constructor(fb: FormBuilder, private store: Store<AppState>, private _authService: AuthService, private _router: Router) {
      this.nameCtrl = fb.control('', Validators.required);
      this.descriptionCtrl = fb.control('', Validators.required);
      this.locationCtrl = fb.control('', Validators.required);
      this.companyForm = fb.group({
          name: this.nameCtrl,
          description: this.descriptionCtrl,
          location: this.locationCtrl
      });
  }

  ngOnInit() {
  }

  onSubmit(): void {
    const payload = this.companyForm.value;
    this.store.dispatch(new CreateWorkspace(payload));
  }
}
