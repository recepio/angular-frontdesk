import { InMemoryDbService } from 'angular-in-memory-web-api';

import { addDays, addHours, startOfToday } from 'date-fns';

const currentDate = addHours(startOfToday(), 12);

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const events = [
      { id: 11, name: 'Mr. Nice', date: addDays(currentDate, 2), duration: { days: 7 }, resource: 11 },
      { id: 12, name: 'Narco', date: addDays(currentDate, 7), duration: { days: 3 }, resource: 12 },
      { id: 13, name: 'Bombasto', date: addDays(currentDate, 10), duration: { days: 1 }, resource: 13 },
      { id: 14, name: 'Celeritas', date: addDays(currentDate, 15), duration: { days: 15 }, resource: 14 },
      { id: 15, name: 'Magneta', date: addDays(currentDate, 6), duration: { days: 3 }, resource: 15 },
      { id: 16, name: 'RubberMan', date: addDays(currentDate, 4), duration: { days: 3 }, resource: 16 },
      { id: 17, name: 'Dynama', date: addDays(currentDate, 0), duration: { days: 3 }, resource: 17 },
      { id: 18, name: 'Dr IQ', date: addDays(currentDate, 6), duration: { days: 3 }, resource: 18 },
      { id: 19, name: 'Magma', date: addDays(currentDate, 7), duration: { days: 3 }, resource: 19 },
      { id: 20, name: 'Tornado', date: addDays(currentDate, 8), duration: { days: 3 }, resource: 20 }
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
    const users = [
      { id: 11, name: 'Mr. Nice' },
      { id: 12, name: 'Narco' },
      { id: 13, name: 'Bombasto' },
      { id: 14, name: 'Celeritas' },
      { id: 15, name: 'Magneta' },
      { id: 16, name: 'RubberMan' },
      { id: 17, name: 'Dynama' },
      { id: 18, name: 'Dr IQ' },
      { id: 19, name: 'Magma' },
      { id: 20, name: 'Tornado' }
    ];
    return { events, resources, users };
  }
}
