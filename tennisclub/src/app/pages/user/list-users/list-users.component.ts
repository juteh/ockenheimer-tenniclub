import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Member} from 'src/app/models/member/member.model';
import {Salutation} from 'src/app/models/member/salutation.enum';

import {EditUserComponent} from './edit-user/edit-user.component';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  private csvContent: string;
  public memberList: Member[] = new Array<Member>();
  public guestList: Member[] = new Array<Member>();

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    var testMember_1: Member = new Member();
    testMember_1.id = 1;
    testMember_1.firstname = 'Leon';
    testMember_1.lastname = 'Adam';
    testMember_1.street = 'Weißenburgstrasse';
    testMember_1.housenumber = 6;
    testMember_1.postcode = '65183';
    testMember_1.city = 'Wiesbaden';
    testMember_1.birthdate = new Date(1991, 6, 20);
    testMember_1.phone = '01631588298';
    testMember_1.salutation = Salutation.MALE;
    testMember_1.age = 27;
    testMember_1.startMembership = new Date(2018, 1, 1);
    testMember_1.membershipYears = 0;
    testMember_1.active = true;
    testMember_1.guest = false;

    var testMember_2: Member = new Member();
    testMember_2.id = 2;
    testMember_2.firstname = 'Unbekannt';
    testMember_2.lastname = null;
    testMember_2.street = null;
    testMember_2.housenumber = null;
    testMember_2.postcode = null;
    testMember_2.city = null;
    testMember_2.birthdate = null;
    testMember_2.phone = null;
    testMember_2.salutation = null;
    testMember_2.age = null;
    testMember_2.startMembership = null;
    testMember_2.membershipYears = null;
    testMember_2.active = false;
    testMember_2.guest = true;

    this.memberList.push(testMember_1);
    this.memberList.push(testMember_1);
    this.memberList.push(testMember_1);
    this.guestList.push(testMember_2);
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = function(e) {
      // you can perform an action with readed data here
      // console.log(myReader.result.toString());
    };

    myReader.readAsText(file);
  }

  openCreateUser() {
    const modalRef = this.modalService.open(EditUserComponent, {size: 'lg'});
    modalRef.componentInstance.createMode = true;

    modalRef.result.then(
        (member: Member) => {
          console.log('create success: ', member);
          this.memberList.push(member);
        },
        (reason) => {

        });
  }

  openEditUser() {
    const modalRef = this.modalService.open(EditUserComponent, {size: 'lg'});
    modalRef.componentInstance.createMode = false;

    modalRef.result.then(
        (result) => {
          console.log('edit success');
        },
        (reason) => {

        });
  }
}
