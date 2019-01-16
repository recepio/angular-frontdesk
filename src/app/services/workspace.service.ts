import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

    private BASE_URL = 'http://localhost:8001/v1/workspace';

    constructor(private http: HttpClient) {}

    createWorkspace(payload): Observable<any> {
        return this.http.post<User>(this.BASE_URL, payload);
    }

    addUser(payload, query): Observable<any> {
        const queryString = this.stringfyQuery(query);
        const url = `${this.BASE_URL}/user/?${queryString}`;
        return this.http.post<User>(url, payload);
    }

    getStatus(): Observable<any> {
        const url = `${this.BASE_URL}/user/companies`;
        return this.http.get(url);
    }

    getUsers(query: {}): Observable<any> {
        const queryString = this.stringfyQuery(query);
        const url = `${this.BASE_URL}/users/?${queryString}`;
        console.log(url);
        return this.http.get(url);
    }

    stringfyQuery(query: {}): string{
        return Object.keys(query).map(key => key + '=' + query[key]).join('&');
    }
}
