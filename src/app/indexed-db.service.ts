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
      const objectStore = evt.currentTarget.result.createObjectStore(
        'users',
        { keyPath: 'id' }
      );

      objectStore.createIndex('name', 'name', { unique: false });
      objectStore.createIndex('email', 'email', { unique: true });
    });
  }

}
