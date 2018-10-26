import {
  Component, DoCheck, ElementRef, Inject, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges,
  ViewChild
} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Area } from '../area';
import { Resource } from '../resource';
import { ResourceService } from '../resource.service';
import { EventService } from '../event.service';
import { HoodieService } from '../hoodie.service';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.scss']
})
export class TimeTableComponent implements OnInit, DoCheck, OnChanges, OnDestroy {
  @Input() area: Area;

  resources: Resource[] = [];

  workareaWidth: number;
  workareaHeight: number;

  private changeSubscription: Subscription;

  @ViewChild('timelineHeaderRef') private timelineHeaderRef: ElementRef;
  @ViewChild('resourceHeaderRef') private resourceHeaderRef: ElementRef;
  @ViewChild('workareaRef') private workareaRef: ElementRef;

  constructor(
    @Inject('resourceService') public resourceService: ResourceService,
    @Inject('eventService') public eventService: EventService,
    private zone: NgZone,
    private hoodieService: HoodieService
  ) { }

  trackByResources(index: number, resource: Resource): string { return resource._id; }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.workareaRef.nativeElement.addEventListener('scroll', this.scroll.bind(this));
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.area) {
      this.load();
    }
  }

  ngDoCheck() {
    this.workareaWidth = this.workareaRef.nativeElement.scrollWidth;
    this.workareaHeight = this.workareaRef.nativeElement.scrollHeight;
  }

  private binarySearch(order: number) {
    let low = 0, high = this.resources.length;
    while (low < high) {
      const mid = (low + high) >>> 1; // faster version of Math.floor((low + high) / 2)
      this.resources[mid].order < order ? low = mid + 1 : high = mid;
    }
    return low;
  }
  private load() {
    const filter = item => item.type === 'resource' && item.area === this.area._id;
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
      console.log('resources unsubscribed');
    }
    this.resources = [];
    this.hoodieService.fetch(filter).then(items => {
      items = items.sort((a, b) => a.order - b.order);
      this.resources = items;
      console.log('resources loaded', items);

      this.changeSubscription = this.hoodieService.changed$.subscribe(({ eventName, object }) => {
        if (!filter(object)) {
          return;
        }
        console.log('resource', eventName, object);
        if (eventName === 'add') {
          const index = this.binarySearch(object.order);
          this.resources.splice(index, 0, object);
        } else {
          const index = this.resources.findIndex(item => item._id === object._id);
          if (eventName === 'update') {
            if (object.order !== index) {
              this.resources.splice(object.order, 0, this.resources.splice(index, 1)[0]);
            } else {
              Object.assign(this.resources[object.order], object);
            }
          } else if (eventName === 'remove') {
            this.resources.splice(index, 1);
          }
        }
      });
    });
  }

  add() {
    let newName: string;
    let i = 0;
    do {
      i++;
      newName = `Resource${i}`;
    } while (this.resources.find(item => item.name === newName));
    const resource = new Resource(this.area._id, newName, this.resources.length);
    this.resourceService.add(resource);
  }

  private scroll() {
    this.timelineHeaderRef.nativeElement.scrollLeft = this.workareaRef.nativeElement.scrollLeft;
    this.resourceHeaderRef.nativeElement.scrollTop = this.workareaRef.nativeElement.scrollTop;
  }

  ngOnDestroy() {
    console.log('resources destroy');
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
      console.log('resources unsubscribed');
    }
  }

}
