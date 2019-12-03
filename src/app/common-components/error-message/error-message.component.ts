import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {EError} from '../../models/error-response';

@Component({
    selector: 'app-error-message',
    templateUrl: './error-message.component.html',
    styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent {
    @Input() formController: FormControl;

    constructor() {
    }

    getErrors() {
        return this.formController.hasError(EError.REQUIRED) ? this.getMessage(EError.REQUIRED)
            : this.formController.hasError(EError.MAX_LENGTH) ? this.getMessage(EError.MAX_LENGTH)
                : this.formController.hasError(EError.MIN_LENGTH) ? this.getMessage(EError.MIN_LENGTH)
                    : '';
    }

    getMessage(errorParam: string): string {
        const errors = this.formController.errors;
        let message: string = '';
        switch (errorParam) {
            case 'required': {
                message = 'This field is required.';
                break;
            }
            case 'minlength': {
                message = `This field should be greater than ${errors.minlength.requiredLength} characters long.`;
                break;
            }
            case 'maxlength': {
                message = `This field should not be greater than ${errors.maxlength.requiredLength} characters long.`;
                break;
            }
        }
        return message;
    }


}
