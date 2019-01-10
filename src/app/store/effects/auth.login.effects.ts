import {Actions, Effect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {map, tap, switchMap, catchError} from 'rxjs/operators';
import {AuthService} from '../../services/auth.service';

import { Item } from '../../item';
import {Injectable} from '@angular/core';
import {of} from 'rxjs/internal/observable/of';
import {AuthActionTypes} from '../actions/ActionTypes';
import {Login, LoginFailure, LoginSuccess, SetStatus} from '../actions/auth.login.actions';
import {mergeMap} from 'rxjs-compat/operator/mergeMap';
import {WorkspaceService} from '../../services/workspace.service';
import {Store} from '@ngrx/store';
import {AppState} from '../index';

@Injectable()
export class AuthLoginEffects <T extends Item> {

    constructor(
        private store: Store<AppState>,
        private actions: Actions,
        private authService: AuthService,
        private workspaceService: WorkspaceService,
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
                        map((data) => {
                            return new LoginSuccess({token: data.token, email: data.user.email});
                        }),
                        catchError((error: any) => of(new LoginFailure(error)) )
                    );
            })
        );

    @Effect({dispatch: false})
    LoginSuccess: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.LOGIN_SUCCESS),
        tap((user) => {
            localStorage.setItem('token', user.payload.token);
            this.router.navigateByUrl('/company/add');
        }),
        switchMap(() => {
            return this.workspaceService.getStatus()
                .pipe(
                    map((data) => {
                       console.log(data);
                       return this.store.dispatch( new SetStatus(data));
                    }),
                    catchError((error: any) => this.router.navigate(['/']) )
                );
        })
    );

    @Effect({dispatch: false})
    LoginFailure: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.LOGIN_FAILURE),
        tap((action) => {
            this.handleError('login effect', action.payload.error);
        })
    );

    @Effect({ dispatch: false })
    public LogOut: Observable<any> = this.actions.pipe(
        ofType(AuthActionTypes.LOGOUT),
        tap((user) => {
            localStorage.removeItem('token');
            this.router.navigateByUrl('/');
        })
    );
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    protected handleError(operation = 'operation', result ? : T ){
        console.log(result);
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
