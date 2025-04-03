import { Pipe, PipeTransform } from '@angular/core';
import { Fee} from './fee';

@Pipe({
  name: 'sort',
  standalone: true
})
export class SortPipe implements PipeTransform {

  transform(value: Fee[], args: keyof Fee = 'id'): Fee[] {
    if (value) {
      return value.sort((a: Fee, b: Fee) => {
        if (a[args] < b[args]) {
          return -1;
        } else if (b[args] < a[args]) {
          return 1;
        }
        return 0;
      });
    }
    return [];
  }

}
