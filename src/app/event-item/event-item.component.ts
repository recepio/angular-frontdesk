import { Component, OnInit, Input, HostBinding, Inject, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Event } from '../event';
import { EventService } from '../event.service';
import { TimelineService } from '../timeline.service';
import { HoodieService } from '../hoodie.service';
import { User } from '../user';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss']
})
export class EventItemComponent implements OnInit, OnDestroy {
  @Input() event: Event;

  users: User[] = [];

  private changeSubscription: Subscription;

  @HostBinding('style.width')
  public get getWidth(): string {
    return `${this.event.duration / 24 / 60 / 60 / 1000 * this.timelineService.dayWidth}px`;
  }

  @HostBinding('style.left')
  public get getLeft(): string {
    const days = (this.event.date.getTime() - this.timelineService.startFrom.getTime()) / 24 / 60 / 60 / 1000;
    return `${days * this.timelineService.dayWidth}px`;
  }

  constructor(
    @Inject('eventService') private eventService: EventService,
    private timelineService: TimelineService,
    private hoodieService: HoodieService
  ) { }

  ngOnInit() {
    this.load();
  }

  private load() {
    const filter = item => item.type === 'user' && this.event.users.includes(item._id);
    this.users = [];
    this.hoodieService.fetch(filter).then(items => {
      this.users = items;
      console.log('users loaded', items);

      this.changeSubscription = this.hoodieService.changed$.subscribe(({ eventName, object }) => {
        if (!filter(object)) {
          return;
        }
        console.log('user', eventName, object);
        if (eventName === 'add') {
          this.users.push(object);
        } else {
          const index = this.users.findIndex(item => item._id === object._id);
          if (eventName === 'update') {
            Object.assign(this.users[index], object);
          } else if (eventName === 'remove') {
            this.users.splice(index, 1);
          }
        }
      });
    });
  }

  delete(event: Event): void {
    this.eventService.remove(event);
  }

  ngOnDestroy() {
    console.log('users destroy');
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
      console.log('users unsubscribed');
    }
  }
}
