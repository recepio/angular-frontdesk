import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

    private modals: any[] = [];
    private data: any[] = [];
    private dataSubject = new Subject();

    add(modal: any) {
        this.modals.push(modal);
    }

    remove(id: string) {
        this.modals = this.modals.filter(x => x.id !== id);
    }

    open(id: string, data: any[] = []) {
        const modal: any = this.modals.filter(x => x.id === id)[0];
        this.data = data;
        this.dataSubject.next(this.data)
        modal.open();
    }

    close(id: string) {
        const modal: any = this.modals.filter(x => x.id === id)[0];
        modal.close();
    }

    getData(): Observable<any> {
        return this.dataSubject.asObservable();
    }
}
