import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {addYears, format, isAfter} from 'date-fns';
import {ModalController} from '@ionic/angular';
import {DATE_FORMAT} from '../../models/date-format.model';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {IAppointment} from '../../models/appointment';

@Component({
    selector: 'app-appointment',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent implements OnInit, OnDestroy {

    appointment: IAppointment;
    appointmentFormGroup: FormGroup;
    displayFormat = 'MMMM DD, YYYY';
    minDate: string;
    maxDate: string;
    endDateMin: string;
    isNew = true;
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private _modalController: ModalController) {
    }

    @Input()
    set appointmentData(data: IAppointment) {
        this.appointmentFormGroup = this.initAppointmentForm();
        if (data) {
            this.isNew = false;
            this.appointment = data;
            this.populateForm(data);
        }
    }

    ngOnInit(): void {
        const currentDate = new Date();
        this.minDate = format(currentDate, DATE_FORMAT.YYYYMMDD);
        this.maxDate = format(addYears(currentDate, 35), DATE_FORMAT.YYYYMMDD);
        this.endDateMin = format(currentDate, DATE_FORMAT.YYYYMMDD);

        this.updateDateRange();
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    /**
     * To close/ dismiss the modal(Popup)
     * @param modalData
     */
    async dismissModal(modalData?: IAppointment): Promise<void> {
        await this._modalController.dismiss(modalData, modalData ? this.isNew ? 'CREATE' : 'UPDATE' : null);
    }

    /**
     * It returns an AbstractControl object with respect of form controller name
     * @param controllerName
     */
    getControl(controllerName: string): AbstractControl {
        return this.appointmentFormGroup.get(controllerName);
    }

    /**
     * It will called when appointment form will submitted
     */
    onSubmit(): void {
        if (!this.appointmentFormGroup.valid) {
            this.markFormGroupTouched(this.appointmentFormGroup);
            return;
        }
        const formValue: IAppointment = this.appointmentFormGroup.value;
        formValue.startDate = format(new Date(formValue.startDate), DATE_FORMAT.YYYYMMDD);
        formValue.endDate = format(new Date(formValue.endDate), DATE_FORMAT.YYYYMMDD);
        if (!this.isNew) {
            formValue.id = this.appointment.id;
        }
        this.dismissModal(formValue);
    }

    /**
     * To create an appointment form
     */
    private initAppointmentForm(): FormGroup {
        return new FormGroup({
            summary: new FormControl('', {
                validators: [Validators.required, Validators.maxLength(255)]
            }),
            location: new FormControl('', {
                validators: [Validators.required, Validators.maxLength(255)]
            }),
            startDate: new FormControl(format(new Date(), DATE_FORMAT.YYYYMMDD), {
                validators: [Validators.required],
                updateOn: 'blur'
            }),
            endDate: new FormControl(format(new Date(), DATE_FORMAT.YYYYMMDD), {
                validators: [Validators.required],
                updateOn: 'blur'
            })
        });
    }

    /**
     * To populate appointment form with an appointment data
     * @param data
     */
    private populateForm(data: IAppointment): void {
        this.appointmentFormGroup.patchValue(data);
    }

    /**
     * To manage dates, start date can not be bigger than end date
     */
    private updateDateRange(): void {
        this.appointmentFormGroup.get('startDate').valueChanges
            .pipe(takeUntil(this._destroy$))
            .subscribe(value => {
                const selectedStartDate = new Date(value);
                const endDateController = this.appointmentFormGroup.get('endDate');
                if (isAfter(selectedStartDate, new Date(endDateController.value))) {
                    this.endDateMin = format(selectedStartDate, DATE_FORMAT.YYYYMMDD);
                    endDateController.setValue(this.endDateMin);
                }
            });

    }

    /**
     * Marks all controls in a form group as touched
     * @param formGroup - The form group to touch
     */
    private markFormGroupTouched(formGroup: FormGroup): void {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }
}
