import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { Event } from '../event';
import { EventService } from '../event.service';
import {BookingService} from '../services/booking.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  events: Event[] = [];
  companyId: string
  constructor(@Inject('eventService') public eventService: EventService,
              private _bookingService: BookingService,
              private route: ActivatedRoute
  ) { }

  ngOnInit() {
      this.route.params.subscribe(params => {
          this.companyId = params['workspaceId'];
      });
      this._bookingService.bookings( {companyId: this.companyId})
          .subscribe(
              (data) => {
                  console.log(data);
                  this.events = data.bookings;
              },
              (error) => {console.log(error.error)}
          );
  }

}
