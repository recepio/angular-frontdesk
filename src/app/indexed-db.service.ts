import { Injectable } from '@angular/core';

import { AngularIndexedDB } from 'angular2-indexeddb';

@Injectable()
export class IndexedDbService {

  public db: AngularIndexedDB;

  constructor() {
    this.db = new AngularIndexedDB('recepio', 1);
  }

  open(): Promise<any> {

    return this.db.openDatabase(1, evt => {
      const userStore = evt.currentTarget.result.createObjectStore('users', { keyPath: 'id' });
      userStore.createIndex('email_idx', 'email', { unique: true });
      userStore.createIndex('name_idx', 'name', { unique: true });
      userStore.createIndex('type_idx', 'type', { unique: false });
      userStore.createIndex('phone_number_idx', 'phone_number', { unique: false });
      userStore.createIndex('citizenship_idx', 'citizenship', { unique: false });

      const eventStore = evt.currentTarget.result.createObjectStore('events', { keyPath: 'id' });
      eventStore.createIndex('date', 'date', { unique: false });

      const areaStore = evt.currentTarget.result.createObjectStore('areas', { keyPath: 'id' });
      areaStore.createIndex('order', 'order', { unique: true });

      const resourceStore = evt.currentTarget.result.createObjectStore('resources', { keyPath: 'id' });
    });
  }

}
