import {CalendarDateFormatter, DateFormatterParams} from 'angular-calendar';
import {DatePipe} from '@angular/common';
import {Injectable} from '@angular/core';

@Injectable()
export class DateFormatter extends CalendarDateFormatter {
    // we can override any of the methods defined in the parent class

    public monthViewColumnHeader({date, locale}: DateFormatterParams): string {
        return new DatePipe(locale).transform(date, 'EEE', locale);
    }
}