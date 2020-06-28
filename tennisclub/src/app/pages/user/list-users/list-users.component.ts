import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Person} from 'src/app/models/person/person.model';
import {Salutation} from 'src/app/models/person/salutation.enum';

import {NotificationComponent} from './../../../components/notification/notification.component';
import {FileService} from './../../../file.service';
import {Drinklist} from './../../../models/drink/drinklist.model';
import {EditUserComponent} from './edit-user/edit-user.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  public memberList: Person[] = new Array<Person>();
  public guestList: Person[] = new Array<Person>();

  public searchText: string;

  @Input() showMember;

  constructor(
      private modalService: NgbModal, private fileService: FileService, private toastr: ToastrService) {
    this.loadPersons();
  }

  loadPersons(): void {
    this.fileService.getFile('/mitglieder.json')
        .then((memberList) => {
          this.memberList = JSON.parse(memberList);
          return this.fileService.getFile('/gaeste.json');
        })
        .then((guestList) => {
          this.guestList = JSON.parse(guestList);
        })
        .catch(
            (err) => {
              this.toastr.error("Fehler beim Laden der Personen");
            });
  }

  ngOnInit(): void {}

  openEditMember(member: Person, index: number) {
    const modalRef = this.modalService.open(EditUserComponent, {size: 'lg'});
    modalRef.componentInstance.createMode = false;
    modalRef.componentInstance.member = member;

    modalRef.result.then((updatedMember: Person) => {
      this.memberList[index] = updatedMember;
      this.updateUserFile('/mitglieder.json', true);
      this.changeTemplate();
      this.toastr.success("Änderungen gespeichert");
    }, (err) => {});
  }

  openEditGuest(member: Person, index: number) {
    const modalRef = this.modalService.open(EditUserComponent, {size: 'lg'});
    modalRef.componentInstance.createMode = false;
    modalRef.componentInstance.member = member;

    modalRef.result.then((updatedGuest: Person) => {
      this.guestList[index] = updatedGuest;
      this.updateUserFile('/gaeste.json', false);
      this.changeTemplate();
      this.toastr.success("Änderungen gespeichert");
    }, (err) => {});
  }

  openCreateMember(): void {
    const modalRef = this.modalService.open(EditUserComponent, {size: 'lg'});
    modalRef.componentInstance.createMode = true;
    modalRef.componentInstance.isGuest = false;

    modalRef.result.then((member: Person) => {
      if (this.memberList.length === 0) {
        member.id = 0;
      } else {
        // Hat immer die nächste höhere ID zum letzten User
        member.id = this.memberList[this.memberList.length - 1].id + 1;
      }
      this.memberList.push(member);
      this.updateUserFile('/mitglieder.json', true);
      this.changeTemplate();
      this.toastr.success("Mitlgied erstellt");
    }, (err) => {});
  }

  openCreateGuest(): void {
    const modalRef = this.modalService.open(EditUserComponent, {size: 'lg'});
    modalRef.componentInstance.createMode = true;
    modalRef.componentInstance.isGuest = true;

    modalRef.result.then((guest: Person) => {
      if (this.guestList.length === 0) {
        guest.id = 1;
      } else {
        guest.id = this.guestList[this.guestList.length - 1].id + 1;
      }
      this.guestList.push(guest);
      this.updateUserFile('/gaeste.json', false);
      this.changeTemplate();
      this.toastr.success("Gast erstellt");
    }, (err) => {});
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
          this.changeTemplate();
          this.toastr.success("Mitglied gelöscht");
        },
        (err) => {

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
          this.changeTemplate();
          this.toastr.success("Gast gelöscht");
        },
        (err) => {

        });
  }

  updateUserFile(path, isMember): Promise<string> {
    if (isMember) {
      return this.fileService.updateFile(path, JSON.stringify(this.memberList));
    } else {
      return this.fileService.updateFile(path, JSON.stringify(this.guestList));
    }
  }

  /**
   * Konvertiert das importierte csv-Files in passendes ObjektListing
   * key entscheidet welches Objekt erzeugt wird
   * member = konvertiere in Mitglieder-Objekt
   * guest = konvertiere in Gast-Objekt
   * drink = konvertiere in Getränk-Objekt
   * Diese Methode muss nur einmalig initial gemacht werden!
   */
  csvConverter(text, key): void {
    for (const entry of text.split('\n')) {
      if (entry && entry.length > 0) {
        if (key === 'member') {
          const newMember: string[] = entry.split(',');
          const member: Person = new Person;

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

  /**
   * Konvertiert die mitglieder.txt in passende memberList
   */
  txtConverter(): void {
    this.fileService.getFile('/mitglieder.txt').then((text) => {
      for (const entry of text.split('\n')) {
        if (entry) {
          this.memberList.push(JSON.parse(entry));
        }
      }
      this.updateUserFile('/mitglieder.json', true);
    });
  }

  /**
   * Die Vorlage muss immer wieder angepasst werden, wenn es Änderungen bei den
   * Personen gibt
   */
  changeTemplate(): void {
    let drinklistTemplate: Drinklist;
    const newPersons: Person[] = [];
    this.fileService.getFile('/getraenkeliste-template.json')
        .then((template) => {
          drinklistTemplate = JSON.parse(template);
          if (drinklistTemplate && drinklistTemplate.users) {
            this.memberList.forEach((member: Person) => {
              if (drinklistTemplate.users.filter(p => member.id === p.id)
                      .length === 1) {
                newPersons.push(member);
              }
            });

            this.guestList.forEach((guest: Person) => {
              if (drinklistTemplate.users.filter(p => guest.id === p.id)
                      .length === 1) {
                newPersons.push(guest);
              }
            });

            drinklistTemplate.users = newPersons;
            this.fileService.updateFile(
                '/getraenkeliste-template.json',
                JSON.stringify(drinklistTemplate));
          }
        })
        .catch((error) => {
          this.toastr.error("Fehler beim Laden von Daten");
        });
  }
}
