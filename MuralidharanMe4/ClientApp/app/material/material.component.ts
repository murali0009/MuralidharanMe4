import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RequiredValidator } from '../validator/CustomValidation/required.validator'
import { UserInfoDto } from '../model/UserInfoDto'
@Component({
   
     styleUrls: [
        '../../../node_modules/@angular/material/prebuilt-themes/indigo-pink.css'
    ],
    // prevent style encapsulation
     encapsulation: ViewEncapsulation.None,

     templateUrl: 'material.component.html'
})


export class MaterialComponent {
    title = 'Kendo Model Driven/ Reactive Form Demo!';
    userDetailForm: FormGroup;
    public userList: Array<UserInfoDto>;
    public genderItems: [
        { value: 'male', viewValue: 'Male' },
        { value: 'female', viewValue: 'Female' }
    ];


    constructor(private fb: FormBuilder) {
        this.createForm();
        this.userList = new Array<UserInfoDto>();
    }

    createForm() {
        this.userDetailForm = this.fb.group({
            Name: ['', Validators.required],
            DoB: ['', Validators.required],
            Gender: [''],
            Age: ['']
        });
    }

    save() {
        this.userList.push(this.userDetailForm.value);
    }
} 