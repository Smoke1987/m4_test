import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../model/User';

@Pipe({
  name: 'userFilter',
  pure: false
})
export class UserFilterPipe implements PipeTransform {
  transform(items: User[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => this.filterObj(item, filter));
  }

  filterObj(obj: any, text: string): boolean {
    let result = false;
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (typeof obj[key] === 'object') {
        result = this.filterObj(obj[key], text);
      } else {
        result = obj[key].indexOf(text) > -1;
      }
    }
    return result;
  }
}
