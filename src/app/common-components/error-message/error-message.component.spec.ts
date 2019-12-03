import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ErrorMessageComponent} from './error-message.component';
import {Component} from "@angular/core";
import {FormControl} from "@angular/forms";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';

@Component({
    selector: 'test-component',
    template: `
    <app-error-message [formController]="formController"></app-error-message>
  `
})
export class TestComponent {
    formController = new FormControl();
}


describe('ErrorMessageComponent', () => {
    let component: ErrorMessageComponent;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ErrorMessageComponent, TestComponent],
            imports: [
                TranslateModule.forRoot({
                    loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}
                })
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.debugElement.children[0].componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
