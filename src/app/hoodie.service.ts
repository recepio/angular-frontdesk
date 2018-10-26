import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as Hoodie from '@hoodie/client';
import PouchDB from 'pouchdb-browser';

@Injectable()
export class HoodieService {
  private hoodie: Hoodie;

  private changeSubject = new Subject();
  changed$ = this.changeSubject.asObservable();

  constructor(private zone: NgZone) {
    this.hoodie = new Hoodie({
      url: 'https://frontdesk-recepio.now.sh',
      PouchDB: PouchDB
    });

    this.hoodie.store.on('change', (eventName, object, options) => {
      console.log(eventName, object, options);
      this.zone.run(() => {
        this.changeSubject.next({ eventName, object, options });
      });
    });

    this.hoodie.account.get('session').then(session => {
      if (session) {
        console.log('signed in');
      } else {
        console.log('signed out');
        this.hoodie.account.signUp({
          username: 'pat@Example.com',
          password: 'secret'
        }).then(accountAttributes => {
          this.hoodie.log.info('Signed up as %s', accountAttributes.username);
        }).catch(error => {
          if (error.name === 'ConflictError') {
            this.hoodie.account.signIn({
              username: 'pat@Example.com',
              password: 'secret'
            }).then(accountAttributes => {
              this.hoodie.log.info('Signed in as %s', accountAttributes.username);
            }).catch(error => {
              this.hoodie.log.error(error);
            });
          } else {
            this.hoodie.log.error(error);
          }
        });
      }
    });

    // this.load();
  }

  private load() {
    this.hoodie.store.findAll().then(items => {
      console.log(items);
    }, error => {
      console.error(error);
    });
  }

  fetch(fn: Function): Promise<any> {
    return this.hoodie.store.findAll(fn);
  }

  get(id: string): Promise<any> {
    return this.hoodie.store.find(id);
  }

  add(type: string, item: any): Promise<any> {
    return this.hoodie.store.add({ type: type, ...item });
  }

  update(item: any): Promise<any> {
    return this.hoodie.store.update(item._id, item);
  }

  remove(item: any): Promise<any> {
    return this.hoodie.store.remove(item._id);
  }

}
