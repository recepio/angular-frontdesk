import { Component, DoCheck, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Resource } from '../resource';
import { Event } from '../event';
import { EventService } from '../event.service';
import { SelectionService } from '../selection.service';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, DoCheck, OnDestroy {

  private subscription: Subscription;
  public workareaWidth: number;

  @ViewChild('timelineHeaderRef', { read: ElementRef }) public timelineHeaderRef: ElementRef<any>;
  @ViewChild('resourceHeaderRef', { read: ElementRef }) public resourceHeaderRef: ElementRef<any>;
  @ViewChild('workareaRef', { read: ElementRef }) public workareaRef: ElementRef<any>;

  constructor(
    public eventService: EventService,
    public resourceService: ResourceService,
    private selectionService: SelectionService
  ) {
    this.subscription = this.selectionService.selectSubject.subscribe(item => {
      console.log(item);
    });
  }

  ngOnInit() {
  }

  trackByResources(index: number, resource: Resource): number { return resource.id; }
  trackByEvents(index: number, event: Event): number { return event.id; }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.eventService.addEvent({ name } as Event).subscribe();
  }

  getEventsByResource(resource: Resource): Event[] {
    return <Event[]>(this.eventService.items).filter(event => event.resource === resource.id);
  }

  scroll () {
    this.timelineHeaderRef.nativeElement.scrollLeft = this.workareaRef.nativeElement.scrollLeft;
    this.resourceHeaderRef.nativeElement.scrollTop = this.workareaRef.nativeElement.scrollTop;
  }

  ngDoCheck() {
    this.workareaWidth = this.workareaRef.nativeElement.scrollWidth;
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
