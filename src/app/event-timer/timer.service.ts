import { Injectable } from '@angular/core';
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
  constructor() { }
  generateTime(timeFromComponent): Time {
     const calcTime = new Time();
     const second = timeFromComponent % 60;
     const minute = Math.floor(timeFromComponent / 60) % 60;
     const hour = Math.floor(timeFromComponent / 3600) % 24;
     const day = Math.floor(timeFromComponent / 86400) ;

     calcTime.seconds = (second < 10) ? '0'+second : second;
     calcTime.minutes = (minute < 10) ? '0'+minute : minute;
     calcTime.hours = (hour < 10) ? '0'+hour : hour;
     calcTime.days = day;
     return calcTime;
  }
}
