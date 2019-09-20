import {Component, OnInit} from '@angular/core';
import {Drink} from 'src/app/models/drink/drink.model';
import {DrinklistSetting} from 'src/app/models/drink/drinklistSetting.model';
import {Member} from 'src/app/models/member/member.model';

import {FileService} from '../../../file.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-edit-list-drink',
  templateUrl: './edit-list-drink.component.html',
  styleUrls: ['./edit-list-drink.component.css']
})
export class EditListDrinkComponent implements OnInit {
  public creator: Member;
  public startDate: Date;
  public endDate: Date;
  public drinks: Drink[];
  public members: Member[];
  public guests: Member[];
  // Beinhaltet Mitglieder und Gäste und den vollen Namen der Person. Notwendig
  // für ng-select
  public selectableCreators: Array<{person: Member, fullname: string}> = [];
  public selectedCreator: {person: Member, fullname: string};
  public selectablePersons: Array<{person: Member, fullname: string}> = [];
  public selectedPerson: {person: Member, fullname: string};
  public addedPersons: Array<{person: Member, fullname: string}> = [];

  // Bei Getränken besteht der volle Name zusätzlich aus Liter und Preis
  public selectableDrinks: Array<{drink: Drink, fullname: string}> = [];
  public selectedDrink: {drink: Drink, fullname: string};
  public addedDrinks: Array<{drink: Drink, fullname: string}> = [];

  public loading = true;

  constructor(private fileService: FileService, public activeModal: NgbActiveModal) {}

  // TODO: Daten in Zwischenspeicher legen, damit beim ausversehen schließen die daten noch da sind
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
          this.createSelectableLists();
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
  }

  // Erstellt Liste aus Mitglieder und Gästen mit ihren vollem Namen sowie für
  // Getränke
  createSelectableLists(): void {
    this.members.forEach((member: Member) => {
      let fullname = '';
      if (member.firstname && !member.lastname) {
        fullname = member.firstname;
      } else if (!member.firstname && member.lastname) {
        fullname = member.lastname;
      } else if (member.firstname && member.lastname) {
        fullname = member.firstname + ' ' + member.lastname;
      }
      this.selectablePersons.push({person: member, fullname: fullname});
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
      this.selectablePersons.push(
          {person: guest, fullname: fullname + ' (Gast)'});
    });
    this.drinks.forEach((drink: Drink) => {
      this.selectableDrinks.push({
        drink: drink,
        fullname: drink.name + ' ' + drink.litres + ' ' + drink.price
      });
    });
    this.selectableCreators = this.selectablePersons;
  }

  save(): void {}

  addDrink($event): void {
    if (this.selectedDrink) {
      // wenn schon vorhanden, nicht hinzufügen
      let duplicate = false;
      this.addedDrinks.forEach(drink => {
        if (drink.drink.id === this.selectedDrink.drink.id) {
          duplicate = true;
        }
      });
      if (!duplicate) {
        this.addedDrinks.push(this.selectedDrink);
      }
      this.selectedDrink = null;
    }
  }

  deleteDrink(index: number): void {
    this.addedDrinks.splice(index, 1);
  }

  addPerson($event): void {
    if (this.selectedPerson) {
      // wenn schon vorhanden, nicht hinzufügen
      let duplicate = false;
      this.addedPersons.forEach(person => {
        if (person.person.id === this.selectedPerson.person.id) {
          duplicate = true;
        }
      });
      if (!duplicate) {
        this.addedPersons.push(this.selectedPerson);
      }
      this.selectedPerson = null;
    }
  }

  deletePerson(index: number): void {
    this.addedPersons.splice(index, 1);
  }

  addCreator($event): void {}

  deleteCreator(): void {
    this.selectedCreator = null;
  }

  addStartDate(): void {}

  addEndDate(): void {}
}
