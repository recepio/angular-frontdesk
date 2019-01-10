import {Injectable} from '@angular/core';
import {Item} from '../../item';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthActionTypes} from '../actions/ActionTypes';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Login, LoginFailure, LoginSuccess} from '../actions/auth.login.actions';
import {of} from 'rxjs/internal/observable/of';
import {WorkspaceService} from '../../services/workspace.service';
import { CreateSuccess, CreateWorkspace} from '../actions/workspace.actions';


@Injectable()
export class WorkspaceEffects  {

    constructor(
        private actions: Actions,
        private workSpaceService: WorkspaceService,
        private router: Router,
    ) {
    }

    @Effect()
    CreateWorkspace: Observable<any> = this.actions
        .pipe(
            ofType(AuthActionTypes.CREATE_WORKSPACE),
            map((action: CreateWorkspace) => action.payload),
            switchMap(payload => {
                return this.workSpaceService.createWorkspace(payload)
                    .pipe(
                        map((data) => {
                            this.router.navigateByUrl('/company/add/user');
                            return new CreateSuccess({workspace: data.workspace});
                        }),
                        catchError((error: any) => of(new LoginFailure(error)))
                    );
            })
        );
}