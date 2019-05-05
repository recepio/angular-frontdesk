import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Event} from '../event';
import {Time, TimerService} from './timer.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-event-timer',
  templateUrl: './event-timer.component.html',
  styleUrls: ['./event-timer.component.scss']
})
export class EventTimerComponent implements OnInit {

  @Input() eventDetails: Event;
  private startTime: Date = null;
  private stopTime: Date = null;
  private timer_id: any;
  private time: number;
  private durationFormat: Time;
  private companyId: string;

  constructor(private timer: TimerService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.companyId = params['workspaceId'];
    });
    this.durationFormat = new Time();
    this.durationFormat.days = '00';
    this.durationFormat.hours = '00';
    this.durationFormat.minutes = '00';
    this.durationFormat.seconds = '00';
    this.startTime = this.eventDetails.startFrom;
    this.stopTime = this.eventDetails.end;
    this.time = new Date().getTime() - new Date(this.eventDetails.startFrom).getTime();
    console.log(new Date().getTime());
    console.log(this.eventDetails.startFrom);
    if(!this.stopTime){
        this.startTimer();
    }else{
        this.durationFormat = this.timer.generateTime(this.time);
        console.log(this.durationFormat);
    }

  }

  @HostListener('click', ['$event']) onClick(evt: MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  startEvent(){
      this.startTime = this.eventDetails.startFrom ? this.eventDetails.startFrom : new Date();
      this.timer.updateBooking({'startFrom': this.startTime, 'id': this.eventDetails.id}, {companyId: this.companyId})
          .subscribe(
              (data) => {
                  console.log(data);
              },
              (error) => {console.log(error.error)}
          );
      this.startTimer();
  }

  startTimer(){
      this.timer_id = setInterval(() =>
      {
          this.time++;
          /**make generaTime a pipe*/
          this.durationFormat = this.timer.generateTime(this.time);
      },1000);
  }

  endEvent(){
      clearInterval(this.timer_id);
      this.stopTime = new Date();
      this.timer.updateBooking({'end': this.stopTime, 'id': this.eventDetails.id}, {companyId: this.companyId})
          .subscribe(
              (data) => {
                  console.log(data);
              },
              (error) => {console.log(error.error)}
          );
  }
}
