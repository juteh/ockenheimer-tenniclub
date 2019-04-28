import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Member} from 'src/app/models/member/member.model';

import {Salutation} from './../../../../models/member/salutation.enum';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  public userForm: FormGroup;
  public salutation: Salutation;

  @Input() createMode: boolean;
  @Input() member: Member;

  constructor(
      public activeModal: NgbActiveModal, private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      firstname: '',
      lastname: '',
      street: '',
      housenumber: '',
      city: '',
      postcode: '',
      salutation: '',
      age: '',
      startMembership: '',
      active: '',
      birthdate: '',
      phone: '',
    });
  }

  ngOnInit(): void {
    if (!this.createMode && this.member) {
      this.userForm.patchValue({
        firstname: this.member.firstname,
        lastname: this.member.lastname,
        street: this.member.street,
        housenumber: this.member.housenumber,
        city: this.member.city,
        postcode: this.member.postcode,
        salutation: this.member.salutation,
        age: this.member.age,
        startMembership: this.member.startMembership,
        active: this.member.active,
        birthdate: this.member.birthdate,
        phone: this.member.phone,
      });
    }
  }

  save(): void {

    this.member.firstname = this.userForm.value.firstname;
    this.member.lastname = this.userForm.value.lastname;
    this.member.street = this.userForm.value.street;
    this.member.housenumber = this.userForm.value.housenumber;
    this.member.city = this.userForm.value.city;
    this.member.postcode = this.userForm.value.postcode;
    this.member.salutation = this.userForm.value.salutation;
    this.member.age = this.userForm.value.age;
    this.member.startMembership = this.userForm.value.startMembership;
    this.member.active = this.userForm.value.active;
    this.member.birthdate = this.userForm.value.birthdate;
    this.member.phone = this.userForm.value.phone;

    this.activeModal.close(this.member);
  }

  setSalutation(salutation: String): void {
    this.userForm.patchValue({salutation: salutation});
  }
}
