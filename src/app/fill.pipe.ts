import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fill'
})
export class FillPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(value);
    const iterable = {};
    iterable[Symbol.iterator] = function* () {
      let n = 0;
      while (n <= value) {
        yield ++n;
      }
    };
    return iterable;
  }

}
