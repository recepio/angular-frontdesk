import { Component, Input, OnInit, Inject, HostListener, ElementRef } from '@angular/core';

import { SelectionService } from '../selection.service';
import { Resource } from '../resource';
import { Event } from '../event';
import { EventService } from '../event.service';
import { TimelineService } from '../timeline.service';

@Component({
  selector: 'app-time-events',
  templateUrl: './time-events.component.html',
  styleUrls: ['./time-events.component.scss']
})
export class TimeEventsComponent implements OnInit {

  private allowedTypes = [
    'application/x-recepio-frontdesk.user',
    'text/plain',
    'Text'];

  @Input() resource: Resource;

  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
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

  @HostListener('drop', ['$event']) onDrop(evt: DragEvent) {
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
    @Inject('eventService') public eventService: EventService,
    @Inject('eventSelectionService') private eventSelectionService: SelectionService,
    @Inject('areaSelectionService') private areaSelectionService: SelectionService,
    private timelineService: TimelineService,
  ) { }

  ngOnInit() {
  }

  trackByEvents(index: number, event: Event): number { return event.id; }

  private getPositionFromEvent(evt: DragEvent) {
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
    const model = this.eventService.getItem(data.id);
    if (false) {
      /*model.set({
        x: position.x / this.scale,
        y: position.y / this.scale
      });
      return model;*/
    } else {
      return this.eventService.add({
        area: this.areaSelectionService.current.id,
        resource: this.resource.id,
        user: data.id,
        date: new Date(this.timelineService.startFrom.getTime() +
          (position.x / this.timelineService.dayWidth * 24 * 60 * 60 * 1000)),
        duration: { days: 3 }
      });
    }
  }

}
