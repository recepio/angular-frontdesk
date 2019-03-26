import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

    private BASE_URL = 'http://localhost:8001/v1/booking';

    constructor(private http: HttpClient) {}

    reserve(payload, query): Observable<any> {
        const queryString = this.stringfyQuery(query);
        const url = `${this.BASE_URL}/?${queryString}`;
        return this.http.post<User>(url, payload);
    }

    bookings( query): Observable<any> {
        const queryString = this.stringfyQuery(query);
        const url = `${this.BASE_URL}/bookings?${queryString}`;
        return this.http.get<User>(url);
    }

    rangeSearch(payload, query): Observable<any> {
        const queryString = this.stringfyQuery(query);
        const url = `${this.BASE_URL}/search/?${queryString}`;
        return this.http.post<User>(url, payload);
    }

    stringfyQuery(query: {}): string{
        return Object.keys(query).map(key => key + '=' + query[key]).join('&');
    }
}
