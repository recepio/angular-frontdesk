import { Component, DoCheck, OnInit, OnDestroy, ViewChild, ElementRef, Inject } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { SelectionService } from '../selection.service';
import { Resource } from '../resource';
import { ResourceService } from '../resource.service';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, DoCheck, OnDestroy {

  private subscription: Subscription;
  public workareaWidth: number;
  public workareaHeight: number;

  @ViewChild('timelineHeaderRef') private timelineHeaderRef: ElementRef;
  @ViewChild('resourceHeaderRef') private resourceHeaderRef: ElementRef;
  @ViewChild('workareaRef') private workareaRef: ElementRef;

  constructor(
    @Inject('resourceService') public resourceService: ResourceService,
    @Inject('resourceSelectionService') public resourceSelectionService: SelectionService,
    @Inject('userService') public userService: UserService,
    @Inject('userSelectionService') public userSelectionService: SelectionService
  ) {
    this.subscription = this.resourceSelectionService.selectSubject.subscribe(item => {
      console.log(item);
    });
  }

  ngOnInit() {
  }

  trackByResources(index: number, resource: Resource): number { return resource.id; }
  trackByUsers(index: number, user: User): number { return user.id; }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    // this.eventService.addEvent({ name } as Event).subscribe();
  }

  scroll () {
    this.timelineHeaderRef.nativeElement.scrollLeft = this.workareaRef.nativeElement.scrollLeft;
    this.resourceHeaderRef.nativeElement.scrollTop = this.workareaRef.nativeElement.scrollTop;
  }

  ngDoCheck() {
    this.workareaWidth = this.workareaRef.nativeElement.scrollWidth;
    this.workareaHeight = this.workareaRef.nativeElement.scrollHeight;
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
