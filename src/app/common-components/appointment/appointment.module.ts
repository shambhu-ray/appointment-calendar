import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppointmentComponent} from './appointment.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ErrorMessageModule} from '../error-message/error-message.module';
import {IonicModule} from '@ionic/angular';


@NgModule({
    declarations: [AppointmentComponent],
    imports: [
        CommonModule,
        IonicModule,
        ReactiveFormsModule,
        ErrorMessageModule
    ],
    exports: [IonicModule],
    entryComponents: [AppointmentComponent]
})
export class AppointmentModule {
}
