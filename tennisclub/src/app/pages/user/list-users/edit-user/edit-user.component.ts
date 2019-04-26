import { Salutation } from './../../../../models/member/salutation.enum';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Member } from 'src/app/models/member/member.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  public userForm: FormGroup;
  public salutation: Salutation;
  private member: Member = new Member();

  @Input() createMode: boolean;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder) {
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

    console.log(this.createMode);
  }

  ngOnInit(): void {
  }

  save(): void {
    console.log(this.userForm);
    this.member = this.userForm.value;
    this.activeModal.close(this.member);
  }

  setSalutation(salutation: String): void {
    console.log(salutation);
    this.userForm.patchValue({salutation: salutation});
  }
}
