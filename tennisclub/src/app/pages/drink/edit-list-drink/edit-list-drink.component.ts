import { Drinklist } from './../../../models/drink/drinklist.model';
import {Component, OnInit, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Drink} from 'src/app/models/drink/drink.model';
import {Member} from 'src/app/models/member/member.model';
import {FileService} from '../../../file.service';
import {DrinklistTemplate} from '../../../models/drink/drinklist-template.model';

@Component({
  selector: 'app-edit-list-drink',
  templateUrl: './edit-list-drink.component.html',
  styleUrls: ['./edit-list-drink.component.css']
})
export class EditListDrinkComponent implements OnInit {
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
  // private drinklistTemplate: DrinklistTemplate = new DrinklistTemplate();
  // Enthält die vom voreingestellten Einstellungen des Templates
  // private drinklistSettings: DrinklistTemplate = new DrinklistTemplate();
  private drinklist: Drinklist = new Drinklist();

  @Input() isTemplate = false;

  constructor(
      private fileService: FileService, public activeModal: NgbActiveModal) {}

  // TODO: Daten in Zwischenspeicher legen, damit beim ausversehen schließen die
  // daten noch da sind
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
          return this.fileService.getFile('/getraenkeliste-template.json');
        })
        .then((drinklistTemplate) => {
          // if (drinklistTemplate) {
            // this.drinklistSettings = JSON.parse(drinklistTemplate);
          // }
          // this.selectedCreator = this.drinklistSettings.creator;

          // this.startDate = this.drinklistSettings.startDate;

          // this.endDate = this.drinklistSettings.endDate;
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

    // console.log(this.drinklistTemplate);
    // if (this.drinklistTemplate && !this.isTemplate) {
      // this.drinklist.creator = this.drinklistTemplate.creator;
      // this.drinklist.startDate = this.drinklistTemplate.startDate;
      // this.drinklist.endDate = this.drinklistTemplate.endDate;
      // if (this.drinklist.users && this.drinklist.users.length > 0) {
        // this.drinklist.users = this.drinklistTemplate.users;
      // }
      // if (this.drinklist.drinks && this.drinklist.drinks.length > 0) {
        // this.drinklist.drinks = this.drinklistTemplate.drinks;
      // }
    // }
  }

  saveDrinkList(): void {
    this.drinklist.creator = this.selectedCreator.person;
    this.drinklist.startDate = this.startDate;
    this.drinklist.endDate = this.endDate;
    const selectedPerson = [];
    this.addedPersons.forEach(person => {
      selectedPerson.push(person.person);
    });
    this.drinklist.users = selectedPerson;
    const selectedDrinks = [];
    this.addedDrinks.forEach(drink => {
      selectedDrinks.push(drink.drink);
    });
    this.drinklist.drinks = selectedDrinks;
    this.activeModal.close(this.drinklist);
  }

  // saveTemplate(): void {
  //   if (this.selectedCreator) {
  //     this.drinklistTemplate.creator = this.selectedCreator.person;
  //   }
  //   this.drinklistTemplate.startDate = this.startDate;
  //   this.drinklistTemplate.endDate = this.endDate;
  //   const selectedPerson = [];
  //   this.addedPersons.forEach(person => {
  //     selectedPerson.push(person.person);
  //   });
  //   this.drinklistTemplate.users = selectedPerson;
  //   const selectedDrinks = [];
  //   this.addedDrinks.forEach(drink => {
  //     selectedDrinks.push(drink.drink);
  //   });
  //   this.drinklistTemplate.drinks = selectedDrinks;

  //   this.activeModal.close(this.drinklistTemplate);
  // }

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

  addCreator($event): void {
    console.log($event);
  }

  deleteCreator(): void {
    this.selectedCreator = null;
  }

  addStartDate(): void {}

  addEndDate(): void {}
}
