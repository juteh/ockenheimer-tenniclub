import {Component, OnInit} from '@angular/core';
import {Drink} from 'src/app/models/drink/drink.model';
import {DrinklistSetting} from 'src/app/models/drink/drinklistSetting.model';
import {Member} from 'src/app/models/member/member.model';

import {FileService} from '../../../file.service';


@Component({
  selector: 'app-edit-list-drink',
  templateUrl: './edit-list-drink.component.html',
  styleUrls: ['./edit-list-drink.component.css']
})
export class EditListDrinkComponent implements OnInit {
  public currentSettings: DrinklistSetting;
  public selectedPersonId: number;
  public avaiableUsers: Member[];
  public avaiableUsersList: String[] = [];

  public creator: Member;
  public startDate: Date;
  public endDate: Date;
  public drinks: Drink[];
  public selectedDrink: Drink;
  public members: Member[];
  public guests: Member[];
  // Beinhaltet Mitglieder und Gäste und den vollen Namen der Person. Notwendig für ng-select
  public persons: Array<{person: Member, fullname: string}> = [];
  public selectedPerson: {person: Member, fullname: string};

  public loading = true;

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.fileService.getFile('/mitglieder.json')
        .then((memberList) => {
          this.members = JSON.parse(memberList);
          return this.fileService.getFile('/gaeste.json');
        })
        .then((guestList) => {
          this.guests = JSON.parse(guestList);
          return this.fileService.getFile('/getraenke.json');
        })
        .then((drinks) => {
          this.drinks = JSON.parse(drinks);
          this.createPersonsList();
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
  }

  // Erstellt Liste aus Mitglieder und Gästen mit ihren vollem Namen
  createPersonsList(): void {
    this.members.forEach((member: Member) => {
      let fullname = '';
      if (member.firstname && !member.lastname) {
        fullname = member.firstname;
      } else if (!member.firstname && member.lastname) {
        fullname = member.lastname;
      } else if (member.firstname && member.lastname) {
        fullname = member.firstname + ' ' + member.lastname;
      }
      this.persons.push({person: member, fullname: fullname});
    });
    this.guests.forEach((guest: Member) => {
      let fullname = '';
      if (guest.firstname && !guest.lastname) {
        fullname = guest.firstname;
      } else if (!guest.firstname && guest.lastname) {
        fullname = guest.lastname;
      } else if (guest.firstname && guest.lastname) {
        fullname = guest.firstname + ' ' + guest.lastname;
      }
      this.persons.push({person: guest, fullname: fullname + " (Gast)"});
    });
  }

  save(): void {}

  delete(): void {}

  addDrink(): void {}

  addPerson(): void {}

  addCreator(): void {}

  addStartDate(): void {}

  addEndDate(): void {}
}
