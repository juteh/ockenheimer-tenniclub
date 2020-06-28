import { Calculation } from './../../../models/drink/calculation.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from './../../../file.service';
import { DrinklistTemplate } from './../../../models/drink/drinklist-template.model';
import { Drinklist } from './../../../models/drink/drinklist.model';
import { Person } from 'src/app/models/person/person.model';
import { Drink } from 'src/app/models/drink/drink.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-create-list-drink',
  templateUrl: './create-list-drink.component.html',
  styleUrls: ['./create-list-drink.component.css']
})
export class CreateListDrinkComponent implements OnInit {
  public startDate: Date;
  public endDate: Date;
  public drinks: Drink[];
  public members: Person[];
  public guests: Person[];
  // Beinhaltet Mitglieder und Gäste und den vollen Namen der Person. Notwendig
  // für ng-select
  public selectableCreators: Array<{personObject: Person, fullname: string}> =
      [];
  public selectedCreator: {personObject: Person, fullname: string};
  public selectablePersons: Array<{personObject: Person, fullname: string}> =
      [];
  public selectedPerson: {personObject: Person, fullname: string};
  public addedPersons: Array<{personObject: Person, fullname: string}> = [];

  // Bei Getränken besteht der volle Name zusätzlich aus Liter und Preis
  public selectableDrinks: Array<{drinkObject: Drink, fullname: string}> = [];
  public selectedDrink: {drinkObject: Drink, fullname: string};
  public addedDrinks: Array<{drinkObject: Drink, fullname: string}> = [];
  private drinklist: Drinklist = new Drinklist();
  public isValid = true;

  @Input() selectedDrinkList: Drinklist;
  @Input() drinkListTemplate: Drinklist;

  constructor(
      private fileService: FileService, public activeModal: NgbActiveModal) {}

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

          // Falls es ein Template übergeben wurde, wird eine neue Getränkeliste
          // erstellte -> Ersteller-Modus. Fall ein vorhandenes Template
          // übergeben wird, wir die aktuelle Getränkeliste angepasst ->
          // Bearbeitungs-Modus.
          if (this.selectedDrinkList || this.drinkListTemplate) {
            let updatingTemplate = null;
            if (this.selectedDrinkList) {
              updatingTemplate = this.selectedDrinkList;
            } else if (this.drinkListTemplate) {
              updatingTemplate = this.drinkListTemplate;
            }
            if (updatingTemplate) {
              this.startDate = updatingTemplate.startDate;
              this.endDate = updatingTemplate.endDate;
              if (updatingTemplate.creator) {
                const name = updatingTemplate.creator.firstname + ' ' +
                updatingTemplate.creator.lastname;
                this.selectedCreator = {
                  personObject: updatingTemplate.creator,
                  fullname: name
                };
              }

              // Vorausgewählte Getränke hinzufügen
              if (updatingTemplate.drinks) {
                updatingTemplate.drinks.forEach(drink => {
                  this.addedDrinks.push({
                    drinkObject: drink,
                    fullname:
                        ' ' + drink.name + ' ' + drink.liter.toFixed(3) + ' ' + drink.price.toFixed(2)
                  });
                });
              }

              // Vorausgewählt Personen hinzufügen
              if (updatingTemplate.users) {
                updatingTemplate.users.forEach(user => {
                  this.addedPersons.push({
                    personObject: user,
                    fullname: user.firstname + ' ' + user.lastname
                  });
                });
              }
            }
          }
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
      // Beim Editieren einer Personenliste kann die addedPersons-Liste schon
      // gefüllt sein. Falls schon vorhanden, darf das Element nicht mehr in
      // selecablePersons hinzugefügt werden.
      let isSelected = false;
      this.addedPersons.forEach(addedPerson => {
        if (!addedPerson.personObject.isGuest &&
            addedPerson.personObject.id === member.id) {
          isSelected = true;
        }
      });
      let fullname = '';
      if (member.firstname && !member.lastname) {
        fullname = member.firstname;
      } else if (!member.firstname && member.lastname) {
        fullname = member.lastname;
      } else if (member.firstname && member.lastname) {
        fullname = member.firstname + ' ' + member.lastname;
      }
      if (!isSelected) {
        this.selectablePersons.push({personObject: member, fullname: fullname});
      }
      this.selectableCreators.push({personObject: member, fullname: fullname});
    });
    this.guests.forEach((guest: Person) => {
      let isSelected = false;
      this.addedPersons.forEach(addedPerson => {
        if (addedPerson.personObject.isGuest &&
            addedPerson.personObject.id === guest.id) {
          isSelected = true;
        }
      });
      let fullname = '';
      if (guest.firstname && !guest.lastname) {
        fullname = guest.firstname;
      } else if (!guest.firstname && guest.lastname) {
        fullname = guest.lastname;
      } else if (guest.firstname && guest.lastname) {
        fullname = guest.firstname + ' ' + guest.lastname;
      }
      if (!isSelected) {
        this.selectablePersons.push(
            {personObject: guest, fullname: fullname + ' (Gast)'});
      }
      this.selectableCreators.push(
          {personObject: guest, fullname: fullname + ' (Gast)'});
    });

    this.drinks.forEach((drink: Drink) => {
      // Beim Editieren einer Getränkeliste kann die addedDrinks-Liste schon
      // gefüllt sein. Falls schon vorhanden, darf das Element nicht mehr in
      // selecableDrinks hinzugefügt werden.
      let isSelected = false;
      this.addedDrinks.forEach(addedDrink => {
        if (addedDrink.drinkObject.id === drink.id) {
          isSelected = true;
        }
      });
      if (!isSelected) {
        this.selectableDrinks.push({
          drinkObject: drink,
          fullname: drink.name + ' ' + drink.liter.toFixed(3) + ' ' + drink.price.toFixed(2)
        });
      }
      this.selectableCreators =
          JSON.parse(JSON.stringify(this.selectableCreators));
    });

    this.sort('DRINKS');
    this.sort('PERSONS');
    this.sort('CREATORS');
  }

  // Wenn nichts ausgewählt wird, sind sie null.
  // Deswegen hat jeder selector eine null-abfrage
  saveDrinkList(): void {
  
    if (this.selectedDrinkList.startDate && this.selectedDrinkList.endDate && new Date(this.selectedDrinkList.startDate.year, this.selectedDrinkList.startDate.month, this.selectedDrinkList.startDate.day) <=
        new Date(this.selectedDrinkList.endDate.year, this.selectedDrinkList.endDate.month, this.selectedDrinkList.endDate.day)) {
          this.isValid = false;
    } else {
      this.isValid = true;
    }

    if (this.isValid) {

      if (this.selectedDrinkList) {
        this.drinklist.id = this.selectedDrinkList.id;
      }
  
      if (this.selectedCreator) {
        this.drinklist.creator = this.selectedCreator.personObject;
      }
  
      if (this.startDate) {
        this.drinklist.startDate = this.startDate;
      }
  
      if (this.endDate) {
        this.drinklist.endDate = this.endDate;
      }
  
      const selectedPerson = [];
      this.addedPersons.forEach(person => {
        selectedPerson.push(person.personObject);
      });
      this.drinklist.users = selectedPerson;
      const selectedDrinks = [];
      this.addedDrinks.forEach(drink => {
        selectedDrinks.push(drink.drinkObject);
      });
      this.drinklist.drinks = selectedDrinks;
      const newCalculations: Array<Array<Calculation>> = [];
      this.addedPersons.forEach((person, i) => {
        newCalculations[i] = [];
        this.addedDrinks.forEach((drink, j) => {
          newCalculations[i][j] = new Calculation(0, person.personObject, drink.drinkObject);
        });
      });
  
      this.drinklist.quantityOfDrinkToPerson = newCalculations;
      if (!this.drinklist.totalCost) {
        this.drinklist.totalCost = 0;
      }
  
  
      this.activeModal.close(this.drinklist);
    }
  }

  addDrink($event): void {
    if (this.selectedDrink) {
      // Entferne ausgewähltes Getränk aus der auswählbaren Liste
      this.selectableDrinks.forEach((drink, deleteIndex) => {
        if (drink.drinkObject.id === this.selectedDrink.drinkObject.id) {
          this.selectableDrinks.splice(deleteIndex, 1);
        }
      });
      // Damit sich die auswählbare liste von ng-select verändert, benötigt sie
      // eine neue Liste damit Angular eine Veränderung merkt. Deswegen wird die
      // Liste kopiert.
      this.selectableDrinks = JSON.parse(JSON.stringify(this.selectableDrinks));
      this.addedDrinks.push(this.selectedDrink);
      this.selectedDrink = null;
    }
  }

  deleteDrink(index: number): void {
    const deletedDrinks = this.addedDrinks.splice(index, 1);
    deletedDrinks.forEach((drink) => {
      this.selectableDrinks.push(drink);
    });
    this.sort('DRINKS');
    this.selectableDrinks = JSON.parse(JSON.stringify(this.selectableDrinks));
    this.selectedDrink = null;
  }

  addPerson($event): void {
    if (this.selectedPerson) {
      this.selectablePersons.forEach((person, deleteIndex) => {
        // Gäste und Mitglieder können dieselbe ID besitzen weil sie aus zwisch
        // verschiedenen Listen kommen. Deswegen Überprüfung von isGuest.
        if (person.personObject.isGuest ===
            this.selectedPerson.personObject.isGuest) {
          if (person.personObject.id === this.selectedPerson.personObject.id) {
            this.selectablePersons.splice(deleteIndex, 1);
          }
        }
      });
      this.selectablePersons =
          JSON.parse(JSON.stringify(this.selectablePersons));

      this.addedPersons.push(this.selectedPerson);
      this.selectedPerson = null;
    }
  }

  deletePerson(index: number): void {
    const deletedPersons = this.addedPersons.splice(index, 1);
    deletedPersons.forEach((person) => {
      this.selectablePersons.push(person);
    });
    this.sort('PERSONS');
    this.selectablePersons = JSON.parse(JSON.stringify(this.selectablePersons));
    this.selectedPerson = null;
  }

  deleteCreator(): void {
    this.selectedCreator = null;
  }

  /**
   * Sortiert Liste von Elementen nach ihren Namen.
   * Umgesetzt für Personen, Ersteller/in und Getränke.
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
    if (key === 'CREATORS') {
      this.selectableCreators.sort(
          (a, b) => (a.fullname > b.fullname) ?
              1 :
              ((b.fullname > a.fullname) ? -1 : 0));
    }
  }
}
