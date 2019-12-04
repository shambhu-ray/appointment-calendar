import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {HomePage} from './home.page';
import {AppointmentModule} from '../common-components/appointment/appointment.module';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {CalendarUtilsModule} from '../common-components/calendar-utils/calendar-utils.module';
import {ToasterService} from '../core/toaster.service';
import {ApiService, BASE_URL} from '../core/api.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {environment} from '../../environments/environment';

describe('HomePage', () => {
    let component: HomePage;
    let fixture: ComponentFixture<HomePage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomePage],
            imports: [
                IonicModule.forRoot(),
                HttpClientTestingModule,
                AppointmentModule,
                CalendarModule.forRoot({
                    provide: DateAdapter,
                    useFactory: adapterFactory
                }),
                CalendarUtilsModule
            ],
            providers: [
                ToasterService,
                ApiService,
                {provide: BASE_URL, useValue: environment.baseUrl},
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HomePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
