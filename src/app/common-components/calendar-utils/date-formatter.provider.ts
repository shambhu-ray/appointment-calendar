import {CalendarDateFormatter, DateFormatterParams} from 'angular-calendar';
import {DatePipe} from '@angular/common';
import {Injectable} from '@angular/core';

@Injectable()
export class DateFormatter extends CalendarDateFormatter {
    // we can override any of the methods defined in the parent class

    public monthViewColumnHeader({date, locale}: DateFormatterParams): string {
        return new DatePipe(locale).transform(date, 'EEE', locale);
    }

    /*public monthViewTitle({ date, locale }: DateFormatterParams): string {
        return new DatePipe(locale).transform(date, 'MMM y', locale);
    }*/
}

export function getTimezoneOffsetString(date: Date): string {
    const timezoneOffset = date.getTimezoneOffset();
    const hoursOffset = String(
        Math.floor(Math.abs(timezoneOffset / 60))
    ).padStart(2, '0');
    const minutesOffset = String(Math.abs(timezoneOffset % 60)).padEnd(2, '0');
    const direction = timezoneOffset > 0 ? '-' : '+';

    return `T00:00:00${direction}${hoursOffset}:${minutesOffset}`;
}