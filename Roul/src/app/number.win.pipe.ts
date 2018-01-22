import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberWin'
})
export class NumberWinPipe implements PipeTransform {

  transform(value: string, args?: any): number {
    return value === '00' ? 37 : +value;
  }

}
