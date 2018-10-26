import { Pipe, PipeTransform } from '@angular/core';

import { User } from './user';

@Pipe({
  name: 'matchesUser',
  pure: false
})
export class MatchesUserPipe implements PipeTransform {

  transform(users: User[], term: string): User[] {
    if (!term.trim()) {
      return users;
    }
    term = term.toLowerCase();
    return users.filter(user => user.name.toLowerCase().indexOf(term) > -1);
  }

}
