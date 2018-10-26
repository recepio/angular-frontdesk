import { Component, Input, OnInit, Inject, HostListener, ElementRef, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { SelectionService } from '../selection.service';
import { Resource } from '../resource';
import { Event } from '../event';
import { EventService } from '../event.service';
import { TimelineService } from '../timeline.service';
import { HoodieService } from '../hoodie.service';

@Component({
  selector: 'app-time-events',
  templateUrl: './time-events.component.html',
  styleUrls: ['./time-events.component.scss']
})
export class TimeEventsComponent implements OnInit, OnDestroy {
  @Input() resource: Resource;

  events: Event[] = [];

  private changeSubscription: Subscription;

  private allowedTypes = [
    'application/x-recepio-frontdesk.user',
    'text/plain',
    'Text'];

  @HostListener('dragover', ['$event']) onDragOver(evt: Event | any) {
    console.log('dragover');
    for (let i = 0; i < evt.dataTransfer.types.length; i++) {
      const type = evt.dataTransfer.types[i];
      if (this.allowedTypes.indexOf(type) === -1) {
        continue;
      }
      evt.dataTransfer.dropEffect = 'move';
      evt.preventDefault();
      return;
    }
  }

  @HostListener('drop', ['$event']) onDrop(evt: Event | any) {
    console.log('drop');
    for (let i = 0; i < this.allowedTypes.length; i++) {
      const type = this.allowedTypes[i];
      if (!evt.dataTransfer.types.includes(type)) {
        continue;
      }

      const position = this.getPositionFromEvent(evt);

      const text = evt.dataTransfer.getData(type);
      console.log('drop', type, text);
      switch (type) {
        case 'application/x-recepio-frontdesk.user':
        {
          const data = JSON.parse(text);
          const model = this.insertUser(data, position);
          this.eventSelectionService.select(model);

          evt.preventDefault();
        }
          return;
        case 'text/plain':
        case 'Text':
        {
          try {
            const data = this.parseUserFromText(text);
            const model = this.insertUser(data, position);
            this.eventSelectionService.select(model);
          } catch (e) {
            /*const model = this.collection.add({
              area: this.options.areaModel.get('index'),
              type: 'text',
              text: text,
              x: position.x,
              y: position.y
            });
            this.selection.select(model);*/
          }

          evt.preventDefault();
        }
          return;
      }
    }
  }

  constructor(
    private elRef: ElementRef,
    @Inject('eventService') private eventService: EventService,
    @Inject('eventSelectionService') private eventSelectionService: SelectionService,
    private timelineService: TimelineService,
    private hoodieService: HoodieService
  ) { }

  trackByEvents(index: number, event: Event): string { return event._id; }

  ngOnInit() {
    this.load();
  }

  private load() {
    const filter = item => item.type === 'event' && item.resource === this.resource._id;
    this.events = [];
    this.hoodieService.fetch(filter).then(items => {
      items.forEach(item => {
        EventService.associate(item);
      });
      this.events = items;
      console.log('events loaded', items);

      this.changeSubscription = this.hoodieService.changed$.subscribe(({ eventName, object }) => {
        if (!filter(object)) {
          return;
        }
        console.log('event', eventName, object);
        if (['add', 'update'].includes(eventName)) {
          EventService.associate(object);
        }
        if (eventName === 'add') {
          this.events.push(object);
        } else {
          const index = this.events.findIndex(item => item._id === object._id);
          if (eventName === 'update') {
            if (object.order !== index) {
              this.events.splice(object.order, 0, this.events.splice(index, 1)[0]);
            } else {
              Object.assign(this.events[object.order], object);
            }
          } else if (eventName === 'remove') {
            this.events.splice(index, 1);
          }
        }
      });
    });
  }

  private getPositionFromEvent(evt: Event | any) {
    let offsetX = this.elRef.nativeElement.offsetLeft;
    let offsetY = this.elRef.nativeElement.offsetTop;

    if (offsetX === undefined || offsetY === undefined) {
      // Firefox doesn't take scale into account so we need to compensate for it
      offsetX = evt.layerX * (window.devicePixelRatio || 1);
      offsetY = evt.layerY * (window.devicePixelRatio || 1);
    }

    const relX = evt.pageX - offsetX;
    const relY = evt.pageY - offsetY;

    return {x: relX, y: relY};
  }

  private parseUserFromText(text: string) {
    if (text.lastIndexOf('user', 0) !== 0) {
      throw new TypeError;
    }

    const data = text.split(' ');
    if (data.length !== 4) {
      throw new RangeError;
    }

    const id = parseInt(data[1]);
    const x = parseFloat(data[2]);
    const y = parseFloat(data[3]);
    if (isNaN(id) || isNaN(x) || isNaN(y)) {
      throw new SyntaxError;
    }
    return {id, x, y};
  }

  private insertUser(data, position) {
    position.x -= data.x;
    position.y -= data.y;
    //const model = this.eventService.getItem(data.id);
    if (false) {
      /*model.set({
        x: position.x / this.scale,
        y: position.y / this.scale
      });
      return model;*/
    } else {
      const date = new Date(this.timelineService.startFrom.getTime() +
        (position.x / this.timelineService.dayWidth * 24 * 60 * 60 * 1000));
      const event = new Event(this.resource._id, date, 3 * 24 * 60 * 60 * 1000);
      event.users = [data.id];
      this.eventService.add(event);
      return event;
    }
  }

  ngOnDestroy() {
    console.log('events destroy');
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
      console.log('events unsubscribed');
    }
  }

}
