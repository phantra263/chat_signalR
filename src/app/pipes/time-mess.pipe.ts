import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'TimeMessFormat'
})
export class TimeMessFormatPipe implements PipeTransform {
  transform(value: any): string {
    // Create a new DatePipe instance to format the date
    const datePipe = new DatePipe('en-US');

    // Format the input date string to the desired format
    const formattedDate = datePipe.transform(value, 'EEE, MMM d, h:mm a');

    return formattedDate || '';
  }
}
