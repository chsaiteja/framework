
/** Angular Imports */
import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
@Pipe({ name: 'customDate' })
export class CustomDate implements PipeTransform {
  transform(value: string): String {
    if (value != null && value != "") {
      value = value.split("T")[0];
      let date: Date;
      date = new Date(value);
      if (date != null) {
        let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);        // to ensure YYYY-MM-DD format
        let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let cmpltDate = month + '/' + day + '/' + date.getFullYear();
        return cmpltDate;
      }

    }

    return "";
  }

}

@Pipe({ name: 'pagesFilter' })
export class pagesFilter {
  transform(pages, [key]) {
    if (pages[key]) {
      //console.log('pageFilter key:' + pages[key]);
      return pages.filter(page => {
        return page[key] === true; // <------
      });
    }
  }
}