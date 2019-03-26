import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Event} from '../event';
import {Time, TimerService} from './timer.service';

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
  private time: number = 0;
  private durationFormat: Time;

  constructor(private timer: TimerService) { }

  ngOnInit() {

    this.durationFormat = new Time();
    this.durationFormat.days = '00';
    this.durationFormat.hours = '00';
    this.durationFormat.minutes = '00';
    this.durationFormat.seconds = '00';
  }

  @HostListener('click', ['$event']) onClick(evt: MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  startEvent(){
      this.startTime = new Date();
      /**notify server*/
      this.timer_id = setInterval(()=>
      {
        this.time++;
        /**make generaTime a pipe*/
        this.durationFormat = this.timer.generateTime(this.time);
      },1000);
  }

  endEvent(){
      clearInterval(this.timer_id);
      this.stopTime = new Date();
      /**notify server*/
  }
}
