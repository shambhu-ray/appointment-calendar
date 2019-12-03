import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {AppointmentComponent} from './appointment.component';

describe('AppointmentComponent', () => {
    let component: AppointmentComponent;
    let fixture: ComponentFixture<AppointmentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppointmentComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(AppointmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
