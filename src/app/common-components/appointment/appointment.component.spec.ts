import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {AppointmentComponent} from './appointment.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ErrorMessageModule} from '../error-message/error-message.module';
import {Component} from '@angular/core';

@Component({
    selector: 'test-component',
    template: `
        <app-appointment [appointmentData]="appointmentData"></app-appointment>
    `
})
export class TestComponent {
    appointmentData = {
        "summary": "Test Appointment",
        "location": "Pune",
        "startDate": "2019-12-30",
        "endDate": "2019-12-30",
        "id": 4
    }
}

describe('AppointmentComponent', () => {
    let component: AppointmentComponent;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppointmentComponent, TestComponent],
            imports: [
                IonicModule.forRoot(),
                ReactiveFormsModule,
                ErrorMessageModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.debugElement.children[0].componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
