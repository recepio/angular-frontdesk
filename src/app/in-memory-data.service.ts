import { InMemoryDbService } from 'angular-in-memory-web-api';

import { addDays, addHours, startOfToday } from 'date-fns';

const currentDate = addHours(startOfToday(), 12);

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const areas = [
      { id: 1, name: 'Rooms' },
      { id: 2, name: 'Parking' },
      { id: 3, name: 'Pool' },
      { id: 4, name: 'Conference rooms' }
    ];
    const events = [
      { id: 11, user_ids: [ 11 ], date: addDays(currentDate, 2), duration: { days: 7 }, resource_ids: [ 1 ] },
      { id: 12, user_ids: [ 12 ], date: addDays(currentDate, 7), duration: { days: 3 }, resource_ids: [ 2 ] },
      { id: 13, user_ids: [ 13 ], date: addDays(currentDate, 10), duration: { days: 1 }, resource_ids: [ 3 ] },
      { id: 14, user_ids: [ 14 ], date: addDays(currentDate, 15), duration: { days: 15 }, resource_ids: [ 4 ] },
      { id: 15, user_ids: [ 15 ], date: addDays(currentDate, 6), duration: { days: 3 }, resource_ids: [ 5 ] },
      { id: 16, user_ids: [ 16 ], date: addDays(currentDate, 4), duration: { days: 3 }, resource_ids: [ 6 ] },
      { id: 17, user_ids: [ 17 ], date: addDays(currentDate, 0), duration: { days: 3 }, resource_ids: [ 7 ] },
      { id: 18, user_ids: [ 18 ], date: addDays(currentDate, 6), duration: { days: 3 }, resource_ids: [ 8 ] },
      { id: 19, user_ids: [ 19 ], date: addDays(currentDate, 7), duration: { days: 3 }, resource_ids: [ 9 ] },
      { id: 20, user_ids: [ 20 ], date: addDays(currentDate, 8), duration: { days: 3 }, resource_ids: [ 10 ] }
    ];
    const resources = [
      { id: 1, name: '101', area_id: 1 },
      { id: 2, name: '102', area_id: 1 },
      { id: 3, name: '103', area_id: 1 },
      { id: 4, name: '104', area_id: 1 },
      { id: 5, name: '105', area_id: 1 },
      { id: 6, name: '106', area_id: 1 },
      { id: 7, name: '107', area_id: 1 },
      { id: 8, name: '108', area_id: 1 },
      { id: 9, name: '109', area_id: 1 },
      { id: 10, name: '110', area_id: 1 },
      { id: 11, name: 'A', area_id: 2 },
      { id: 12, name: 'B', area_id: 2 },
      { id: 13, name: 'C', area_id: 2 },
      { id: 14, name: 'D', area_id: 2 },
      { id: 15, name: 'E', area_id: 2 },
      { id: 16, name: 'F', area_id: 2 },
      { id: 17, name: 'G', area_id: 2 },
      { id: 18, name: 'H', area_id: 2 },
      { id: 19, name: 'I', area_id: 2 },
      { id: 20, name: 'J', area_id: 2 },
      { id: 21, name: '1', area_id: 3 },
      { id: 22, name: '2', area_id: 3 },
      { id: 23, name: '3', area_id: 3 },
      { id: 24, name: '4', area_id: 3 },
      { id: 25, name: '1', area_id: 4 },
      { id: 26, name: '2', area_id: 4 },
      { id: 27, name: '3', area_id: 4 },
      { id: 28, name: '4', area_id: 4 },
      { id: 29, name: '5', area_id: 4 },
      { id: 30, name: '6', area_id: 4 }
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
    return { areas, events, resources, users };
  }
}
