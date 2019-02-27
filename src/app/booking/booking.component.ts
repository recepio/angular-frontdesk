import {Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {addDays, isFirstDayOfMonth} from 'date-fns';
import {TimelineService} from '../timeline.service';
import {ChangeContext} from '../booking-slider/booking-slider.component';
import {Store} from '@ngrx/store';
import {AppState, selectAuthState} from '../store';
import {Observable} from 'rxjs/Observable';
import {Area} from '../area';
import {ModalService} from '../services/modal.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BookingComponent implements OnInit, OnChanges {
  width: number = 800;
  height: number = 150;
  paddingLeft: number = 1;
  minValue: number = this.timelineService.startFrom.getTime();
  maxValue: number = addDays(this.timelineService.startFrom,3).getTime();
  dateRange: string = '';
  modalId: string;

  areas: Area[];
  getState: Observable<any>;
  public fitDays = 31;
  public isFirstDay = isFirstDayOfMonth;

  constructor(public timelineService: TimelineService,
              private store: Store<AppState>,
              private modalService: ModalService) {
      this.getState = this.store.select(selectAuthState);
  }

  @HostListener('click', ['$event']) onClick(evt: MouseEvent) {
      evt.preventDefault();
      evt.stopPropagation();
  }
  ngOnInit() {
      this.getState.subscribe((state) => {
          this.areas = state.areas;
          console.log(this.areas);
      });
    this.dateRange = `value: ${new Date(this.minValue).toDateString()} , highValue: ${new Date(this.maxValue).toDateString()}`;
  }

  addDays (i: number): Date {
    return addDays(this.timelineService.startFrom, i);
  }

  onUserChangeStart(changeContext: ChangeContext): void {
    this.dateRange = `${this.getChangeContextString(changeContext)}`;
  }

  onUserChange(changeContext: ChangeContext): void {
    this.dateRange = `${this.getChangeContextString(changeContext)}`;
  }

  onUserChangeEnd(changeContext: ChangeContext): void {
    this.dateRange = `${this.getChangeContextString(changeContext)}`;
  }

  getChangeContextString(changeContext: ChangeContext): string {
    return `value: ${new Date(changeContext.value).toDateString()}, ` + `highValue: ${new Date(changeContext.highValue).toDateString()}`;
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes.width) {
          this.fitDays = Math.floor(changes.width.currentValue / this.timelineService.dayWidth);
      }
  }
  openModal(id: string) {
    this.modalId = id;
    this.modalService.open(id)
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
