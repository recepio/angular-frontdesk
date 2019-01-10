import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {AppState} from '../../store';
import {SignUp} from '../../store/actions/auth.signup.actions';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-sign-up',
    templateUrl: './auth-sign-up.component.html',
    styleUrls: ['./auth-sign-up.component.scss']
})
export class AuthSignUpComponent implements OnInit {

    userForm: FormGroup;
    emailCtrl: FormControl;
    passwordCtrl: FormControl;

    constructor(private store: Store<AppState>, fb: FormBuilder, private _authService: AuthService, private _router: Router ) {
        this.emailCtrl = fb.control('', Validators.required);
        this.passwordCtrl = fb.control('', Validators.required);
        this.userForm = fb.group({
            email: this.emailCtrl,
            password: this.passwordCtrl
        });
    }

    ngOnInit() {
        if (this._authService.getToken()){
            this._router.navigate(['/company/add']);
        }
    }

    onSubmit(): void {
        const payload = this.userForm.value;
        this.store.dispatch(new SignUp(payload));
    }
}
