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

    getStatus(): Observable<any> {
        const url = `${this.BASE_URL}/user/companies`;
        return this.http.get(url);
    }
}
