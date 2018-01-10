import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class DialogService {

  private showModalSource = new Subject<any>();
  private hideModalSource = new Subject<any>();

  showModal$ = this.showModalSource.asObservable();
  hideModal$ = this.hideModalSource.asObservable();

  showModal(component: any, data?: Map<string, any>) {
    this.showModalSource.next({ component, data });
  }

  hideModal() {
    this.hideModalSource.next();
  }

}
