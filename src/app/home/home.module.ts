import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {HomePage} from './home.page';
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {CalendarUtilsModule} from "../common-components/calendar-utils/calendar-utils.module";
import {AppointmentModule} from '../common-components/appointment/appointment.module';

const routes: Routes = [
    {
        path: '',
        component: HomePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        AppointmentModule,
        RouterModule.forChild(routes),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        CalendarUtilsModule
    ],
    declarations: [HomePage]
})
export class HomePageModule {
}
