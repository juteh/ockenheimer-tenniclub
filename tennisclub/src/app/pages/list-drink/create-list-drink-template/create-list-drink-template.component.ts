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
  public drinks: Drink[] = [];
  public members: Person[];
  public guests: Person[];
  public persons: Person[] = [];

  public selectablePersons:
      Array<{personObject: Person, fullname: string, checked: boolean}> = [];
  public checkFormPerson: boolean[] = [];
  public checkFormDrink: boolean[] = [];

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.fileService.getFile('/mitglieder.json')
        .then((memberList) => {
          this.members = JSON.parse(memberList);
          return this.fileService.getFile('/gaeste.json');
        })
        .then((guestList) => {
          this.guests = JSON.parse(guestList);
          this.persons = [...this.members, ...this.guests];
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

  createSelectableLists(): void {
    this.persons.forEach((person: Person) => {
      if (this.drinklistTemplate.users
              .filter(
                  personTemplate =>
                      (person.id === personTemplate.id &&
                       person.isGuest === personTemplate.isGuest))
              .length === 0) {
        this.checkFormPerson.push(false);
      } else {
        this.checkFormPerson.push(true);
      }
    });

    this.drinks.forEach((drink: Drink) => {
      if (this.drinklistTemplate.drinks
              .filter(drinkTemplate => (drink.id === drinkTemplate.id))
              .length === 0) {
        this.checkFormDrink.push(false);
      } else {
        this.checkFormDrink.push(true);
      }
    });
  }

  private saveTemplate(): void {
    const template = new Drinklist();
    template.creator = null;
    template.startDate = null;
    template.endDate = null;
    template.id = 0;
    const currentPersons: Person[] = [];
    const currentDrinks: Drink[] = [];

    this.checkFormPerson.forEach((check: boolean, index: number) => {
      if (check) {
        currentPersons.push(this.persons[index]);
      }
    });

    this.checkFormDrink.forEach((check: boolean, index: number) => {
      if (check) {
        currentDrinks.push(this.drinks[index]);
      }
    });

    template.users = currentPersons;
    template.drinks = currentDrinks;

    this.fileService.updateFile(
        '/getraenkeliste-template.json', JSON.stringify(template));
  }

  checkPerson(index: number, check: boolean): void {
    this.checkFormPerson[index] = check;
    this.saveTemplate();
  }

  checkDrink(index: number, check: boolean): void {
    this.checkFormDrink[index] = check;
    this.saveTemplate();
  }
}
