import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Member} from 'src/app/models/member/member.model';
import {Salutation} from 'src/app/models/member/salutation.enum';

import {NotificationComponent} from './../../../components/notification/notification.component';
import {FileService} from './../../../file.service';
import {EditUserComponent} from './edit-user/edit-user.component';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  public memberList: Member[] = new Array<Member>();
  public guestList: Member[] = new Array<Member>();

  constructor(
      private modalService: NgbModal, private fileService: FileService) {
    fileService.getFile('/mitglieder.json')
        .then((memberList) => {
          this.memberList = JSON.parse(memberList);
          return fileService.getFile('/gaeste.json');
        })
        .then((guestList) => {
          this.guestList = JSON.parse(guestList);
        })
        .catch((err) => {
          console.log(err);
        });
  }

  ngOnInit(): void {}

  openEditMember(member: Member, index: number) {
    const modalRef = this.modalService.open(EditUserComponent, {size: 'lg'});
    modalRef.componentInstance.createMode = false;
    modalRef.componentInstance.member = member;

    modalRef.result.then(
        (updatedMember: Member) => {
          this.memberList[index] = updatedMember;
          this.updateUserFile('/mitglieder.json', true);
        },
        (err) => {
          console.log(err);
        });
  }

  openEditGuest(member: Member, index: number) {
    const modalRef = this.modalService.open(EditUserComponent, {size: 'lg'});
    modalRef.componentInstance.createMode = false;
    modalRef.componentInstance.member = member;

    modalRef.result.then(
        (updatedGuest: Member) => {
          this.guestList[index] = updatedGuest;
          this.updateUserFile('/gaeste.json', false);
        },
        (err) => {
          console.log(err);
        });
  }

  openCreateMember(): void {
    const modalRef = this.modalService.open(EditUserComponent, {size: 'lg'});
    modalRef.componentInstance.createMode = true;
    modalRef.componentInstance.isGuest = false;

    modalRef.result.then(
        (member: Member) => {
          if (this.guestList.length === 0) {
            member.id = 1;
          } else {
            // Hat immer die nächste höhere ID zum letzten User
            member.id = this.memberList[this.memberList.length - 1].id + 1;
          }
          this.memberList.push(member);
          this.updateUserFile('/mitglieder.json', true);
        },
        (err) => {
          console.log(err);
        });
  }

  openCreateGuest(): void {
    const modalRef = this.modalService.open(EditUserComponent, {size: 'lg'});
    modalRef.componentInstance.createMode = true;
    modalRef.componentInstance.isGuest = true;

    modalRef.result.then(
        (guest: Member) => {
          if (this.guestList.length === 0) {
            guest.id = 1;
          } else {
            guest.id = this.guestList[this.guestList.length - 1].id + 1;
          }
          this.guestList.push(guest);
          this.updateUserFile('/gaeste.json', false);
        },
        (err) => {
          console.log(err);
        });
  }

  deleteMember(index: number): void {
    const modalRef =
        this.modalService.open(NotificationComponent, {size: 'lg'});

    modalRef.componentInstance.headline = 'Mitglied löschen';
    modalRef.componentInstance.description =
        'Wollen Sie wirklich dieses Mietglied löschen?';

    modalRef.result.then(
        (result) => {
          this.memberList.splice(index, 1);
          this.updateUserFile('/mitglieder.json', true);
        },
        (err) => {
          console.log(err);
        });
  }

  deleteGuest(index: number): void {
    const modalRef =
        this.modalService.open(NotificationComponent, {size: 'lg'});

    modalRef.componentInstance.headline = 'Gast löschen';
    modalRef.componentInstance.description =
        'Wollen Sie wirklich diesen Gast löschen?';


    modalRef.result.then(
        (result) => {
          this.guestList.splice(index, 1);
          this.updateUserFile('/gaeste.json', false);
        },
        (err) => {
          console.log(err);
        });
  }

  updateUserFile(path, isMember): void {
    if (isMember) {
      this.fileService.updateFile(path, JSON.stringify(this.memberList));
    } else {
      this.fileService.updateFile(path, JSON.stringify(this.guestList));
    }
  }

  /**
   * Konvertiert das importierte Text-File in passendes ObjektListing
   * key entscheidet welches Objekt erzeugt wird
   * member = konvertiere in Mitglieder-Objekt
   * guest = konvertiere in Gast-Objekt
   * drink = konvertiere in Getränk-Objekt
   * Diese Methode muss nur einmalig initial gemacht werden!
   */
  textConverter(text, key): void {
    for (const entry of text.split('\n')) {
      if (entry && entry.length > 0) {
        if (key === 'member') {
          const newMember: string[] = entry.split(',');
          const member: Member = new Member;

          member.id = +newMember[0];

          member.lastname = newMember[2].split('"')[1];

          member.firstname = newMember[3].split('"')[0];

          member.street = newMember[4].split('.')[0];

          if (newMember[4].split('.').length > 1) {
            member.housenumber = newMember[4].split('.')[1];
          }
          member.postcode = newMember[5].split(' ')[0];
          if (newMember[5].split('.').length > 1) {
            member.city = newMember[5].split('.')[1];
          }
          member.birthdate = newMember[6];
          member.phone = newMember[7];
          member.startMembership = newMember[8];
          if (newMember[9] === 'männlich') {
            member.salutation = Salutation.MALE;
          } else if (newMember[9] === 'weiblich') {
            member.salutation = Salutation.FEMALE;
          } else {
            member.salutation = Salutation.OTHER;
          }

          if (newMember[10] === 'Aktiv') {
            member.active = true;
          } else {
            member.active = false;
          }

          member.age = +newMember[11];

          member.membershipYears = +newMember[12];

          this.memberList.push(member);
        }
      }
    }
  }
}
