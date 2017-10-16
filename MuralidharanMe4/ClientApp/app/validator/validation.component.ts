import { Component, Input, Output } from '@angular/core';

@Component({
    selector: 'common-validation-message',
    templateUrl: 'validation.component.html'
})


export class ValidationComponent {

    public controlInput: any;


    @Input() public set control(control: any) {
        this.controlInput = control;
    }


}