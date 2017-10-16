
import { Input, Directive, forwardRef } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS} from '@angular/forms';


@Directive({
    selector: '[validateRequired][ngModel],[validateRequired][formControl]',
    //extend the built-in validators NG_VALIDATORS to use our Required validator in providers.
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => RequiredValidator), multi: true }
    ]
})


export class RequiredValidator implements Validator {

    @Input('control') control: string;


    validate(c: AbstractControl): { [key: string]: any } {
        
        let value = c.value;
        try {

            if (String(value).length > 0 && value != null) {
                return null;
            }

        } catch (err) {
        }


        return { required: true };
    }

}