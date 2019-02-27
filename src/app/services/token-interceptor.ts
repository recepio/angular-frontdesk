import {Injectable, Injector} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {AppState} from '../store';
import {catchError, first, flatMap} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import {Router} from '@angular/router';
import {LogOut} from '../store/actions/auth.login.actions';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private authService: AuthService;
    constructor(private injector: Injector) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.authService = this.injector.get(AuthService);
        const token: string = this.authService.getToken();
        request = request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return next.handle(request);
    }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router, private store: Store<AppState>) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request)
            .pipe(
                catchError((response: any) => {
                        if (response instanceof HttpErrorResponse && response.status === 401) {
                            this.store.dispatch(new LogOut({}));
                        }
                        return _throw(response);
                    })
            )
    }

}