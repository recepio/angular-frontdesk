import { Injectable } from '@angular/core';

@Injectable()
export class TimelineService {

  startFrom: Date = new Date();
  dayWidth = 240;

  constructor() { }

}
