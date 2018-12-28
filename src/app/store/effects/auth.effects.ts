import {Actions, Effect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthActionTypes, Login, LoginSuccess} from '../actions/auth.actions';
import {map, tap, switchMap, catchError} from 'rxjs/operators';
import {AuthService} from '../../services/auth.service';

import { Item } from '../../item';
import {Injectable} from '@angular/core';
import {of} from 'rxjs/internal/observable/of';

@Injectable()
export class AuthEffects <T extends Item> {

    constructor(
        private actions: Actions,
        private authService: AuthService,
        private router: Router,
    ) {
    }

    @Effect()
    Login: Observable<any> = this.actions
        .pipe(
            ofType(AuthActionTypes.LOGIN),
            map((action: Login) => action.payload),
            switchMap(payload => {
                return this.authService.login(payload.email, payload.password)
                    .pipe(
                        map((user) => {
                            console.log(user);
                            return new LoginSuccess({token: user.token, email: payload.email});
                        }),
                        catchError(this.handleError('Login Effect')
                    );
            })
        );

    @Effect({dispatch: false})
    LoginSuccess: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.LOGIN_SUCCESS),
        tap((user) => {
            /*localStorage.setItem('token', user);
            this.router.navigateByUrl('/');*/
        })
    );

    @Effect({dispatch: false})
    LoginFailure: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.LOGIN_FAILURE)
    );

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    protected handleError(operation = 'operation', result?: T ) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
