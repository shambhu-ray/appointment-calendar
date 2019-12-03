import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {CalendarDateFormatter, CalendarEvent, CalendarView} from "angular-calendar";
import {Subject} from "rxjs";
import {DateFormatter} from "../common-components/calendar-utils/date-formatter.provider";
import {endOfMonth, format, isSameDay, isSameMonth, startOfMonth} from 'date-fns';
import {HttpParams} from "@angular/common/http";
import {map, takeUntil, tap} from "rxjs/operators";
import {ApiService} from "../core/api.service";
import {ActionSheetController, ModalController} from '@ionic/angular';
import {AppointmentComponent} from '../common-components/appointment/appointment.component';
import {COLORS} from '../models/colors.model';
import {DATE_FORMAT} from '../models/date-format.model';

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
export class HomePage implements OnInit, OnDestroy {
    view: CalendarView = CalendarView.Month;
    viewDate: Date = new Date();
    activeDayIsOpen: boolean = false;
    appointments: CalendarEvent[];
    refresh: Subject<any> = new Subject();
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    // events$: Observable<Array<CalendarEvent<{ appointment: IAppointmentModel }>>>;

    constructor(
        private _apiService: ApiService,
        private _modalCtrl: ModalController,
        private _actionSheetCtrl: ActionSheetController
    ) {
    }

    ngOnInit(): void {
        this.fetchAppointments();
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    dayClicked({date, events}: {
        date: Date;
        events: Array<CalendarEvent<{ appointment: IAppointment }>>;
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

    appointmentClicked(event: CalendarEvent<{ appointment: IAppointment }>): void {
        console.log('# => ', event);
        this.appointmentActionSheet(event.meta.appointment);

    }

    async presentModal(data?: IAppointment) {
        const modal = await this._modalCtrl.create({
            component: AppointmentComponent,
            componentProps: {'appointmentData': data || null}
        });
        modal.onWillDismiss().then((event) => {
            console.log('dismissed data ->', event);
            if (event.role === 'CREATE') {
                this.createAppointment(event.data);
            } else if (event.role === 'UPDATE') {
                this.updateAppointment(event.data);
            }
        });
        return await modal.present();
    }

    async appointmentActionSheet(appointment: IAppointment) {
        const actionSheet = await this._actionSheetCtrl.create({
            header: 'Appointment',
            buttons: this.actionButtons(appointment)
        });
        await actionSheet.present();
    }

    private fetchAppointments(): void {
        const params = new HttpParams()
            .set('startDate_gte', format(startOfMonth(this.viewDate), DATE_FORMAT.YYYYMMDD))
            .set('startDate_lte', format(endOfMonth(this.viewDate), DATE_FORMAT.YYYYMMDD));

        this._apiService.get('appointments', undefined, params)
            .pipe(
                takeUntil(this._destroy$),
                map((appointments: IAppointment[]) => {
                    return appointments.map((appointment: IAppointment) => {
                        return {
                            title: appointment.summary,
                            start: new Date(appointment.startDate),
                            end: new Date(appointment.endDate),
                            color: isSameDay(new Date(appointment.startDate), this.viewDate) ? COLORS.blue : COLORS.yellow,
                            meta: {appointment}
                        }
                    })
                }),
                tap(resp => console.log(resp))
            )
            .subscribe(resp => {
                console.log('appointments ->', resp);
                this.appointments = resp;
                this.refresh.next();
            });
    }

    private createAppointment(appointment: IAppointment) {
        this._apiService.post<IAppointment>('appointments', appointment)
            .pipe(takeUntil(this._destroy$))
            .subscribe(resp => {
                console.log(resp);
            });
    }

    private updateAppointment(appointment: IAppointment) {
        this._apiService.put<IAppointment>(`appointments/${appointment.id}`, appointment)
            .pipe(takeUntil(this._destroy$))
            .subscribe(resp => {
                console.log(resp);
            });
    }

    private deleteAppointment(appointmentId: number) {
        this._apiService.delete(`appointments/${appointmentId}`)
            .pipe(takeUntil(this._destroy$))
            .subscribe(resp => {
                console.log(resp);
                this.appointments = this.appointments.filter(item => item.id !== appointmentId);
                this.refresh.next();
            })
    }

    private actionButtons(appointment: IAppointment): any[] {
        return [
            {
                text: 'Edit', icon: 'create',
                handler: () => {
                    console.log('Edit clicked');
                    this.presentModal(appointment);
                }
            },
            {
                text: 'Delete', role: 'destructive', icon: 'trash',
                handler: () => {
                    console.log('Delete clicked');
                    this.deleteAppointment(appointment.id);
                }
            },
            {
                text: 'Cancel', icon: 'close', role: 'cancel'
            }
        ]
    }


}
