import {Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {addDays, isFirstDayOfMonth} from 'date-fns';
import {TimelineService} from '../timeline.service';
import {ChangeContext} from '../booking-slider/booking-slider.component';
import {Store} from '@ngrx/store';
import {AppState, selectAuthState} from '../store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs';
import {Area} from '../area';
import {ModalService} from '../services/modal.service';
import {Item} from '../item';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';
import {AddArea, LoadWorkSpace} from '../store/actions/workspace.actions';
import {ActivatedRoute} from '@angular/router';
import {BookingService} from '../services/booking.service';

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
  companyId: string;

  areas: Area[];
  resources: any[];
  resource: any[];
  clients: Item[];
  bookingForm: FormGroup;
  rangeForm: FormGroup;
  clientCtrl: FormControl;
  dateFromCtrl: FormControl;
  dateToCtrl: FormControl;
  resourceNameCtrl: FormControl;
  resourceIdCtrl: FormControl;
  getState: Observable<any>;
  private $dateRange: Subscription;
  private dataSubject = new Subject();
  public fitDays = 31;
  public isFirstDay = isFirstDayOfMonth;

  constructor(public timelineService: TimelineService,
              private store: Store<AppState>,
              private  fb: FormBuilder,
              private route: ActivatedRoute,
              private _bookingService: BookingService,
              private modalService: ModalService) {
      this.getState = this.store.select(selectAuthState);
  }

  @HostListener('click', ['$event']) onClick(evt: MouseEvent) {
      evt.preventDefault();
      evt.stopPropagation();
  }
  ngOnInit() {
      this.modalService.getData().subscribe((data) => {
          this.resource = data;
      });
      this.getState.subscribe((state) => {
          this.clients = state.clients;
      });
      this.route.params.subscribe(params => {
          this.companyId = params['workspaceId'];
      });
    this.dateRange = `value: ${new Date(this.minValue).toDateString()} , highValue: ${new Date(this.maxValue).toDateString()}`;
    this.$dateRange = this.listenAndSuggest();
    this.dataSubject.next(this.intialContext());
    this.clientCtrl = this.fb.control('', Validators.required);
    this.dateFromCtrl = this.fb.control('', Validators.required);
    this.dateToCtrl = this.fb.control('', Validators.required);
    this.resourceIdCtrl = this.fb.control('', Validators.required);
    this.resourceNameCtrl = this.fb.control('', Validators.required);
    this.dateFromCtrl.setValue(new Date(this.minValue).toDateString());
    this.dateToCtrl.setValue(new Date(this.maxValue).toDateString());
    this.bookingForm = this.fb.group({
          userEmail: this.clientCtrl,
          dateFrom: this.dateFromCtrl,
          dateTo: this.dateToCtrl,
          resourceId: this.resourceIdCtrl,
          resourceName: this.resourceNameCtrl
      });
    this.rangeForm = this.fb.group({
        dateFrom: this.dateFromCtrl,
        dateTo: this.dateToCtrl
    });
  }

  addDays (i: number): Date {
    return addDays(this.timelineService.startFrom, i);
  }

  onUserChangeStart(changeContext: ChangeContext): void {
    this.dataSubject.next(changeContext);
  }

  onUserChange(changeContext: ChangeContext): void {
    this.dataSubject.next(changeContext);
  }

  onUserChangeEnd(changeContext: ChangeContext): void {
    this.dataSubject.next(changeContext);
  }

  getChangeContextString(changeContext: ChangeContext): string {
    return `value: ${changeContext.value}, ` + `highValue: ${changeContext.highValue}`;
  }

  private intialContext(): ChangeContext {
    const changeContext: ChangeContext = new ChangeContext();
    changeContext.value = new Date(this.minValue).toDateString();
    changeContext.highValue = new Date(this.maxValue).toDateString();
    return changeContext;
  }

  listenAndSuggest() {
      return this.dataSubject.asObservable().
          pipe(
              debounceTime(500),
              distinctUntilChanged(),
              tap((range: ChangeContext) => {
                  this.dateFromCtrl.setValue(range.value);
                  this.dateToCtrl.setValue(range.highValue);
                  this.dateRange = `${this.getChangeContextString(range)}`;
              }),
              switchMap((range: ChangeContext) => {return this.suggest()})
          ).
          subscribe((results) => {
            console.log(results);
            this.resources = results.resources;
          });
  }
  ngOnChanges(changes: SimpleChanges) {
      if (changes.width) {
          this.fitDays = Math.floor(changes.width.currentValue / this.timelineService.dayWidth);
      }
  }
  openModal(id: string, data: any[]) {
    this.modalId = id;
    this.resourceIdCtrl.setValue(data['id']);
    this.resourceNameCtrl.setValue(data['name']);
    this.modalService.open(id, data);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  suggest(){
    return this._bookingService.rangeSearch(this.rangeForm.value, {companyId: this.companyId})
  }

  createReservation(){
    console.log(this.bookingForm.value);
      this._bookingService.reserve(this.bookingForm.value, {companyId: this.companyId})
          .subscribe(
              (data) => {
                  console.log(data);
                  this.closeModal(this.modalId);
              },
              (error) => {console.log(error.error)}
          );
  }
}
