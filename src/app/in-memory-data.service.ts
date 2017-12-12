import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const events = [
      { id: 11, name: 'Mr. Nice', date: new Date(2017, 11, 12), duration: { days: 7 }, resource: 11 },
      { id: 12, name: 'Narco', date: new Date(2017, 11, 17), duration: { days: 3 }, resource: 12 },
      { id: 13, name: 'Bombasto', date: new Date(2017, 11, 20), duration: { days: 1 }, resource: 13 },
      { id: 14, name: 'Celeritas', date: new Date(2017, 11, 21), duration: { days: 5 }, resource: 14 },
      { id: 15, name: 'Magneta', date: new Date(2017, 11, 16), duration: { days: 3 }, resource: 15 },
      { id: 16, name: 'RubberMan', date: new Date(2017, 11, 14), duration: { days: 3 }, resource: 16 },
      { id: 17, name: 'Dynama', date: new Date(2017, 11, 10), duration: { days: 3 }, resource: 17 },
      { id: 18, name: 'Dr IQ', date: new Date(2017, 11, 16), duration: { days: 3 }, resource: 18 },
      { id: 19, name: 'Magma', date: new Date(2017, 11, 17), duration: { days: 3 }, resource: 19 },
      { id: 20, name: 'Tornado', date: new Date(2017, 11, 18), duration: { days: 3 }, resource: 20 }
    ];
    const resources = [
      { id: 11, name: '101' },
      { id: 12, name: '102' },
      { id: 13, name: '103' },
      { id: 14, name: '104' },
      { id: 15, name: '105' },
      { id: 16, name: '106' },
      { id: 17, name: '107' },
      { id: 18, name: '108' },
      { id: 19, name: '109' },
      { id: 20, name: '110' }
    ];
    return { events, resources };
  }
}
