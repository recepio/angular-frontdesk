import { Pipe, PipeTransform } from '@angular/core';

import { Event } from './event';

@Pipe({
  name: 'matchesResource',
  pure: false
})
export class MatchesResourcePipe implements PipeTransform {

  transform(events: Event[], resource: number): Event[] {
    return ;//events.filter(event => event.resource === resource);
  }

}
