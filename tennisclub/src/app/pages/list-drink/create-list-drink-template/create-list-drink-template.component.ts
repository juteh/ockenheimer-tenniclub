import {Component, OnInit} from '@angular/core';
import {Drink} from 'src/app/models/drink/drink.model';

import {FileService} from '../../../file.service';
import {Drinklist} from '../../../models/drink/drinklist.model';
import {Person} from '../../../models/person/person.model';

@Component({
  selector: 'app-create-list-drink-template',
  templateUrl: './create-list-drink-template.component.html',
  styleUrls: ['./create-list-drink-template.component.css']
})
export class CreateListDrinkTemplateComponent implements OnInit {
  public drinklistTemplate: Drinklist;
  public drinks: Drink[];
  public members: Person[];
  public guests: Person[];

  public selectablePersons:
      Array<{personObject: Person, fullname: string, checked: boolean}> = [];
  public addedPersons: Array<{personObject: Person, fullname: string}> = [];

  public selectableDrinks:
      Array<{drinkObject: Drink, fullname: string, checked: boolean}> = [];
  public addedDrinks: Array<{drinkObject: Drink, fullname: string}> = [];

  constructor(private fileService: FileService) {}

  public onCheckboxChangePersons(event, index) {
    if (event.target.checked) {
      this.addedPersons.push(this.selectablePersons[index]);
    } else {
      this.addedPersons.forEach((person, i) => {
        if (person.fullname === this.selectablePersons[index].fullname &&
            person.personObject.id ===
                this.selectablePersons[index].personObject.id) {
          this.addedPersons.splice(i, 1);
          return;
        }
      });
    }
    this.saveTemplate();
  }

  public onCheckboxChangeDrinks(event, index) {
    if (event.target.checked) {
      this.addedDrinks.push(this.selectableDrinks[index]);
    } else {
      this.addedDrinks.forEach((drink, i) => {
        if (drink.fullname === this.selectableDrinks[index].fullname &&
            drink.drinkObject.id ===
                this.selectableDrinks[index].drinkObject.id) {
          this.addedDrinks.splice(i, 1);
          return;
        }
      });
    }
    this.saveTemplate();
  }

  private saveTemplate(): void {
    const template = new Drinklist();
    const persons = new Array<Person>();
    const drinks = new Array<Drink>();
    template.creator = null;
    template.startDate = null;
    template.endDate = null;
    this.addedPersons.forEach((person) => {
      persons.push(person.personObject);
    });
    template.users = persons;
    this.addedDrinks.forEach((drink) => {
      drinks.push(drink.drinkObject);
    });
    template.drinks = drinks;
    this.fileService.updateFile(
        '/getraenkeliste-template.json', JSON.stringify(template));
  }

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
        .then((template) => {
          this.drinklistTemplate = JSON.parse(template);
          this.createSelectableLists();
        })
        .catch((err) => {
          console.log(err);
        });
  }

  // Erstellt Liste aus Mitglieder und Gästen mit ihren vollem Namen sowie für
  // Getränke
  createSelectableLists(): void {
    this.members.forEach((member: Person) => {
      let fullname = '';
      if (member.firstname && !member.lastname) {
        fullname = member.firstname;
      } else if (!member.firstname && member.lastname) {
        fullname = member.lastname;
      } else if (member.firstname && member.lastname) {
        fullname = member.firstname + ' ' + member.lastname;
      }

      let isSelected = false;
      this.drinklistTemplate.users.forEach((userOfTemplate) => {
        if (userOfTemplate.id === member.id &&
            !userOfTemplate.isGuest) {
          this.addedPersons.push({
            personObject: member,
            fullname: fullname,
          });
          isSelected = true;
        }
      });

      this.selectablePersons.push(
          {personObject: member, fullname: fullname, checked: isSelected});
    });

    this.guests.forEach((guest: Person) => {
      let fullname = '';
      if (guest.firstname && !guest.lastname) {
        fullname = guest.firstname;
      } else if (!guest.firstname && guest.lastname) {
        fullname = guest.lastname;
      } else if (guest.firstname && guest.lastname) {
        fullname = guest.firstname + ' ' + guest.lastname;
      }

      let isSelected = false;
      this.drinklistTemplate.users.forEach((userOfTemplate) => {
        if (userOfTemplate.id === guest.id && userOfTemplate.isGuest) {
          this.addedPersons.push({
            personObject: guest,
            fullname: fullname + ' (Gast)',
          });
          isSelected = true;
        }
      });

      this.selectablePersons.push({
        personObject: guest,
        fullname: fullname + ' (Gast)',
        checked: isSelected
      });
    });

    this.drinks.forEach((drink: Drink) => {
      let isSelected = false;
      this.drinklistTemplate.drinks.forEach((drinkOfTemplate) => {
        if (drink.id === drinkOfTemplate.id) {
          this.addedDrinks.push({
            drinkObject: drink,
            fullname: drink.name + ' ' + drink.litres + ' ' + drink.price
          });
          isSelected = true;
        }
      });
      this.selectableDrinks.push({
        drinkObject: drink,
        fullname: drink.name + ' ' + drink.litres + ' ' + drink.price,
        checked: isSelected
      });
    });

    this.sort('DRINKS');
    this.sort('PERSONS');
  }

  /**
   * Sortiert Liste von Elementen nach ihren Namen.
   * Umgesetzt für Personen und Getränke.
   */
  sort(key: string): void {
    if (key === 'DRINKS') {
      this.selectableDrinks.sort(
          (a, b) => (a.fullname > b.fullname) ?
              1 :
              ((b.fullname > a.fullname) ? -1 : 0));
    }
    if (key === 'PERSONS') {
      this.selectablePersons.sort(
          (a, b) => (a.fullname > b.fullname) ?
              1 :
              ((b.fullname > a.fullname) ? -1 : 0));
    }
  }
}
