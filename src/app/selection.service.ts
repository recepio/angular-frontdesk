import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SelectionService {

  public current: any;
  public selected: any[] = [];

  private currentSubject = new Subject();
  private selectSubject = new Subject();

  currentChanged$ = this.currentSubject.asObservable();
  selectedChanged$ = this.selectSubject.asObservable();

  select (item: any, clear = true) {
    if (clear) {
      this.clear();
    }
    if (this.current) {
      this.currentSubject.next({ current: this.current, select: false });
    }
    this.current = item;
    if (item) {
      this.currentSubject.next({ item, select: true });
      this.selected.push(item);
      this.selectSubject.next({ item, select: true });
    }
  }

  clear() {
    this.selected.length = 0;
  }
}
