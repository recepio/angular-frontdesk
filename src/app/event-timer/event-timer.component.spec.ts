import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTimerComponent } from './event-timer.component';

describe('EventTimerComponent', () => {
  let component: EventTimerComponent;
  let fixture: ComponentFixture<EventTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
