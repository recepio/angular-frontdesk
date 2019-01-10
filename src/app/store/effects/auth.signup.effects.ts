import {Actions, Effect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {map, tap, switchMap, catchError} from 'rxjs/operators';
import {AuthService} from '../../services/auth.service';

import { Item } from '../../item';
import {Injectable} from '@angular/core';
import {of} from 'rxjs/internal/observable/of';
import {AuthActionTypes} from '../actions/ActionTypes';
import {Login, LoginFailure, LoginSuccess} from '../actions/auth.login.actions';
import {SignUp} from '../actions/auth.signup.actions';

@Injectable()
export class AuthSignUpEffects <T extends Item> {

    constructor(
        private actions: Actions,
        private authService: AuthService,
        private router: Router,
    ) {
    }

    @Effect()
    SignUp: Observable<any> = this.actions
        .pipe(
            ofType(AuthActionTypes.SIGNUP),
            map((action: SignUp) => action.payload),
            switchMap(payload => {
                return this.authService.signUp(payload.email, payload.password)
                    .pipe(
                        map((data) => {
                            console.log(data);
                            return new LoginSuccess({token: data.token, email: payload.email});
                        }),
                        catchError((error: any) => of(new LoginFailure(error)) )
                    );
            })
        );


    }
