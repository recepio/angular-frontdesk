import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeEventsComponent } from './time-events.component';

describe('TimeEventsComponent', () => {
  let component: TimeEventsComponent;
  let fixture: ComponentFixture<TimeEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
