import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CalendarDateFormatter, CalendarEvent, CalendarView} from "angular-calendar";
import {Observable, Subject} from "rxjs";
import {colors} from "../calendar-utils/colors";
import {DateFormatter} from "../calendar-utils/date-formatter.provider";
import {endOfMonth, format, isSameDay, isSameMonth, startOfMonth} from 'date-fns';
import {HttpParams} from "@angular/common/http";
import {map, tap} from "rxjs/operators";
import {ApiService} from "../core/api.service";

interface Appointment {
    id: number;
    summary: string;
    location: string;
    startDate: string;
    endDate: string;
}

function getTimezoneOffsetString(date: Date): string {
    const timezoneOffset = date.getTimezoneOffset();
    const hoursOffset = String(
        Math.floor(Math.abs(timezoneOffset / 60))
    ).padStart(2, '0');
    const minutesOffset = String(Math.abs(timezoneOffset % 60)).padEnd(2, '0');
    const direction = timezoneOffset > 0 ? '-' : '+';

    return `T00:00:00${direction}${hoursOffset}:${minutesOffset}`;
}

@Component({
    selector: 'app-home',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    providers: [
        {
            provide: CalendarDateFormatter,
            useClass: DateFormatter
        }
    ]
})
export class HomePage implements OnInit {
    view: CalendarView = CalendarView.Month;
    viewDate: Date = new Date();
    refresh: Subject<any> = new Subject();
    activeDayIsOpen: boolean = true;
    events$: Observable<Array<any>>;

    // events$: Observable<Array<CalendarEvent<{ appointment: Appointment }>>>;

    constructor(private _apiService: ApiService) {
    }

    ngOnInit(): void {
        this.fetchEvents();
    }

    fetchEvents(): void {
        const params = new HttpParams()
            .set(
                'startDate_gte',
                format(startOfMonth(this.viewDate), 'yyyy-MM-dd')
            )
            .set(
                'startDate_lte',
                format(endOfMonth(this.viewDate), 'yyyy-MM-dd')
            );

        this.events$ = this._apiService.get('appointments', undefined, params)
            .pipe(
                map((appointments: Appointment[]) => {
                    return appointments.map((appointment: Appointment) => {
                        return {
                            title: appointment.summary,
                            start: new Date(
                                appointment.startDate + getTimezoneOffsetString(this.viewDate)
                            ),
                            color: colors.yellow,
                            allDay: true,
                            meta: {
                                appointment
                            }
                        }
                    })

                }),
                tap(resp => console.log(resp))
            );
    }

    /*events: Array<CalendarEvent<{ incrementsBadgeTotal: boolean }>> = [
        {
            title: 'Increments badge total on the day cell',
            color: colors.yellow,
            start: new Date(),
            end: new Date(1578095722828),
            meta: {
                incrementsBadgeTotal: true
            }
        },
        {
            title: 'Does not increment the badge total on the day cell',
            color: colors.blue,
            start: new Date(),
            meta: {
                incrementsBadgeTotal: true
            }
        },
        {
            title: 'Test badge total on the day cell',
            color: colors.yellow,
            start: new Date(1578095722828),
            meta: {
                incrementsBadgeTotal: true
            }
        },
    ];*/

    dayClicked({date, events}: {
        date: Date;
        events: Array<CalendarEvent<{ appointment: Appointment }>>;
    }): void {
        if (isSameMonth(date, this.viewDate)) {
            if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    eventClicked(event: CalendarEvent<{ appointment: Appointment }>): void {
        console.log('# => ', event);
        /*window.open(
            `https://www.themoviedb.org/movie/${event.meta.appointment.id}`,
            '_blank'
        );*/
    }

}
