import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/user';
export class Time {
    days: string | number;
    hours: string | number;
    minutes: string | number;
    seconds: string | number;
}
@Injectable({
  providedIn: 'root'
})
export class TimerService {
  timers: any[];
    private BASE_URL = 'http://localhost:8001/v1/booking';

    constructor(private http: HttpClient) {}

    updateBooking(payload, query): Observable<any> {
        const queryString = this.stringfyQuery(query);
        const url = `${this.BASE_URL}/update?${queryString}`;
        return this.http.post<User>(url, payload);;
    }

   stringfyQuery(query: {}): string{
       return Object.keys(query).map(key => key + '=' + query[key]).join('&');
   }

   generateTime(timeFromComponent): Time {
     const calcTime = new Time();
     const second = timeFromComponent % 60;
     const minute = Math.floor(timeFromComponent / 60) % 60;
     const hour = Math.floor(timeFromComponent / 3600) % 24;
     const day = Math.floor(timeFromComponent / 86400) ;

     calcTime.seconds = (second < 10) ? `0${second}` : second;
     calcTime.minutes = (minute < 10) ? `0${minute}` : minute;
     calcTime.hours = (hour < 10) ? `0${hour}` : hour;
     calcTime.days = day;
     return calcTime;
  }
}
