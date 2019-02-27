import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSliderComponent } from './booking-slider.component';

describe('BookingSliderComponent', () => {
  let component: BookingSliderComponent;
  let fixture: ComponentFixture<BookingSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
