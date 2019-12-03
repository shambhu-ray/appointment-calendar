import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CalendarModule} from 'angular-calendar';
import {CalendarHeaderComponent} from './calendar-header.component';
import {IonicModule} from "@ionic/angular";

@NgModule({
    imports: [CommonModule, FormsModule, CalendarModule, IonicModule],
    declarations: [CalendarHeaderComponent],
    exports: [CalendarHeaderComponent]
})
export class CalendarUtilsModule {
}