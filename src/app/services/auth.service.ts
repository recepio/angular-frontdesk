import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import {catchError} from 'rxjs/operators';
import 'rxjs/add/observable/throw';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private BASE_URL = 'http://localhost:8001/v1/auth';

    constructor(private http: HttpClient) {}

    getToken(): string {
        return localStorage.getItem('token');
    }

    login(email: string, password: string): Observable<any> {
        const payload = {
            email: email,
            password: password
        };
        const url = `${this.BASE_URL}/login`;
        return this.http.post<User>(url, payload);
    }

    signUp(email: string, password: string): Observable<User> {
        const payload = {
            email: email,
            password: password
        };
        const url = `${this.BASE_URL}/signup`;
        return this.http.post(url, payload);
    }
}
