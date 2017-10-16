import { Component, ViewEncapsulation } from '@angular/core';
import { UserInfoDto } from '../model/UserInfoDto'


@Component({
    styleUrls: [
        '../../../node_modules/@progress/kendo-theme-default/dist/all.css'
    ],
    // prevent style encapsulation
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'kendo.component.html'
})

// Demo Kendo + Template driven form

export class KendoComponent {
    title = 'Kendo Template Driven Form Demo!';


    public genderItems: Array<string> = ["Male", "Female"];
    public min: number = 18;
    public max: number = 99;
    public smallStep: number = 1;
    public userList: Array<UserInfoDto>;

    public userIndo: UserInfoDto;

    constructor() {
        this.userIndo = new UserInfoDto();
        this.userList = new Array<UserInfoDto>();
    }


    // Can use this way as well: save(value: any)
    save(value: any) {
        this.userList.push(value);
    }
} 
