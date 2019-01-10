import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {AppState, selectAuthState} from './store';
import {LogOut, SetStatus} from './store/actions/auth.login.actions';
import {WorkspaceService} from './services/workspace.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
    title = 'Title';
    getState: Observable<any>;
    isAuthenticated: false;
    user = null;
    workspaces = null;
    workspace = null;
    errorMessage = null;

    constructor(private store: Store<AppState>, private _workspaceService: WorkspaceService, private _router: Router) {
        this.getState = this.store.select(selectAuthState);
    }

    ngOnInit() {
        this._workspaceService.getStatus()
            .subscribe(
                (data) => {this.store.dispatch(new SetStatus(data))},
                (error) => {this._router.navigate(['/'])}
                );
        this.getState.subscribe((state) => {
            this.isAuthenticated = state.isAuthenticated;
            this.user = state.user;
            this.errorMessage = state.errorMessage;
            this.workspaces = state.workSpaces;
            console.log(state);
        });
    }

    logOut(): void {
        this.store.dispatch(new LogOut({}));
    }
}
