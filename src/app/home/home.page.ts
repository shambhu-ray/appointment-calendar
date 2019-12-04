import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {CalendarDateFormatter, CalendarEvent, CalendarView} from 'angular-calendar';
import {Subject} from 'rxjs';
import {DateFormatter} from '../common-components/calendar-utils/date-formatter.provider';
import {endOfMonth, format, isSameDay, isSameMonth, startOfMonth} from 'date-fns';
import {HttpParams} from '@angular/common/http';
import {map, takeUntil, tap} from 'rxjs/operators';
import {ApiService} from '../core/api.service';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {AppointmentComponent} from '../common-components/appointment/appointment.component';
import {COLORS} from '../models/colors.model';
import {DATE_FORMAT} from '../models/date-format.model';
import {ToasterService} from '../core/toaster.service';
import {IAppointment} from '../models/appointment';

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

    constructor(
        private _apiService: ApiService,
        private _modalCtrl: ModalController,
        private _toasterService: ToasterService,
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

    /**
     * Get an event when click on day tile of calendar
     * It's responsible to open/close events(appointments) list on calendar
     * @param date - it's hold date of clicked day
     * @param events - it's hold events(appointments) of clicked day
     */
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

    /**
     * To open a modal(Popup) for create/ update an appointment
     * @param data - it's an optional, holds appointment details
     */
    async presentModal(data?: IAppointment) {
        const modal = await this._modalCtrl.create({
            component: AppointmentComponent,
            componentProps: {'appointmentData': data || null}
        });

        /**
         * Takes an event when modal(Popup) will be closed/ dismissed
         */
        modal.onWillDismiss().then((event) => {
            if (event.role === 'CREATE') {
                this.createAppointment(event.data);
            } else if (event.role === 'UPDATE') {
                this.updateAppointment(event.data);
            }
        });
        return await modal.present();
    }

    /**
     * It will get an event when an event(appointment) will be clicked
     * @param event
     */
    async appointmentClicked(event: CalendarEvent<{ appointment: IAppointment }>): Promise<void> {
        await this.appointmentActionSheet(event.meta.appointment);
    }

    /**
     * It will open an action buttons as a list for clicked calendar appointment
     * @param appointment
     */
    async appointmentActionSheet(appointment: IAppointment) {
        const actionSheet = await this._actionSheetCtrl.create({
            header: 'Appointment',
            buttons: [
                {
                    text: 'Edit', icon: 'create',
                    handler: () => {
                        this.presentModal(appointment);
                    }
                },
                {
                    text: 'Delete', role: 'destructive', icon: 'trash',
                    handler: () => {
                        this.deleteAppointment(appointment.id);
                    }
                },
                {
                    text: 'Cancel', icon: 'close', role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }

    /**
     * To get appointments from backend
     */
    fetchAppointments(): void {
        this.activeDayIsOpen = false;
        const params = new HttpParams()
            .set('startDate_gte', format(startOfMonth(this.viewDate), DATE_FORMAT.YYYYMMDD))
            .set('startDate_lte', format(endOfMonth(this.viewDate), DATE_FORMAT.YYYYMMDD));

        this._apiService.get('appointments', undefined, params)
            .pipe(
                takeUntil(this._destroy$),
                map((appointments: IAppointment[]) => {
                    return appointments.map((appointment: IAppointment) => {
                        if (isSameDay(new Date(appointment.startDate), this.viewDate)) {
                            this.activeDayIsOpen = true;
                        }
                        return {
                            title: appointment.summary,
                            start: new Date(appointment.startDate),
                            end: new Date(appointment.endDate),
                            color: isSameDay(new Date(appointment.startDate), this.viewDate) ? COLORS.blue : COLORS.yellow,
                            meta: {appointment}
                        }
                    })
                })
            )
            .subscribe(resp => {
                this.appointments = resp;
                this.refresh.next();
            });
    }

    /**
     * To create an appointment
     * @param appointment - takes IAppointment type object
     */
    private createAppointment(appointment: IAppointment) {
        this._apiService.post<IAppointment>('appointments', appointment)
            .pipe(
                takeUntil(this._destroy$),
                tap(() => this._toasterService.presentToast('Appointment created successfully'))
            )
            .subscribe(() => {
                this.fetchAppointments();
            });
    }

    /**
     * To update an appointment
     * @param appointment - takes IAppointment type object
     */
    private updateAppointment(appointment: IAppointment) {
        this._apiService.put<IAppointment>(`appointments/${appointment.id}`, appointment)
            .pipe(
                takeUntil(this._destroy$),
                tap(() => this._toasterService.presentToast('Appointment updated successfully'))
            )
            .subscribe(() => {
                this.fetchAppointments();
            });
    }

    /**
     * To delete an appointment
     * @param appointmentId - takes appointment id as a number
     */
    private deleteAppointment(appointmentId: number) {
        this._apiService.delete(`appointments/${appointmentId}`)
            .pipe(
                takeUntil(this._destroy$),
                tap(() => this._toasterService.presentToast('Appointment deleted successfully'))
            )
            .subscribe(() => {
                this.fetchAppointments();
            });
    }
}
