import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Drink} from 'src/app/models/drink/drink.model';

import {NotificationComponent} from '../../../components/notification/notification.component';
import {FileService} from '../../../file.service';
import {Drinklist} from '../../../models/drink/drinklist.model';
import {CreateListDrinkTemplateComponent} from '../create-list-drink-template/create-list-drink-template.component';

import {Calculation} from './../../../models/drink/calculation.model';
import {Person} from './../../../models/person/person.model';
import {CreateListDrinkComponent} from './../create-list-drink/create-list-drink.component';
import {ListDrinkCalculaterComponent} from './../list-drink-calculater/list-drink-calculater.component';
import {DrinkListView} from './drink-list-view';


@Component({
  selector: 'app-list-drinks',
  templateUrl: './list-drinks.component.html',
  styleUrls: ['./list-drinks.component.css']
})
export class ListDrinksComponent implements OnInit {
  private drinkListings: Drinklist[] = [];
  // Für das Suchen muss die Drinkliste, die einzelnen Parameter zu Strings
  // zusammen gebracht werden
  public drinkListViews: DrinkListView[] = [];
  public searchText: string;
  // Liste aus Indexen von Getränkelisten zum erstellen einer Gesamtliste
  public bindingList: number[] = [];
  private drinkListTemplate: Drinklist;

  constructor(
      private fileService: FileService, private modalService: NgbModal) {
    this.getDrinkListingFromJson();
  }

  ngOnInit(): void {}

  // Lädt die Getränkeliste aus dem JSON und schreibt driekt ViewItems
  getDrinkListingFromJson(): void {
    this.fileService.getFile('/getraenkelisten.json')
        .then((drinkListings) => {
          this.drinkListings = JSON.parse(drinkListings);
          this.drinkListingConvertToView();
          return this.fileService.getFile('/getraenkeliste-template.json');
        })
        .then((template) => {
          this.drinkListTemplate = JSON.parse(template);
        })
        .catch((err) => {});
  }

  drinkListingConvertToView(): void {
    this.drinkListViews = [];
    for (const drinkListing of this.drinkListings) {
      let name = 'Keiner gewählt';
      if (drinkListing.creator) {
        name = drinkListing.creator.firstname + ' ' +
            drinkListing.creator.lastname;
      }
      let startDate = '';

      if (drinkListing.startDate) {
        startDate = drinkListing.startDate['day'] + '.' +
            drinkListing.startDate['month'] + '.' +
            drinkListing.startDate['year'];
      }

      let endDate = '';
      if (drinkListing.endDate) {
        endDate = drinkListing.endDate['day'] + '.' +
            drinkListing.endDate['month'] + '.' + drinkListing.endDate['year'];
      }

      const time = startDate + ' - ' + endDate;

      let totalCost = '';
      if (drinkListing.totalCost) {
        totalCost = drinkListing.totalCost + ' €';
      }
      this.drinkListViews.push(
          new DrinkListView(drinkListing.id + '', name, time, totalCost));
    }
  }

  openCreateDrinklist(): void {
    const modalRef = this.modalService.open(
        CreateListDrinkComponent, {windowClass: 'my-custom-modal-width'});
    modalRef.componentInstance.drinkListTemplate = this.drinkListTemplate;
    modalRef.result.then(
        (drinklist: Drinklist) => {
          if (this.drinkListings.length === 0) {
            drinklist.id = 1;
          } else {
            drinklist.id =
                this.drinkListings[this.drinkListings.length - 1].id + 1;
          }
          this.drinkListings.push(drinklist);
          this.fileService.updateFile(
              '/getraenkelisten.json', JSON.stringify(this.drinkListings));
          this.drinkListingConvertToView();
        },
        (err) => {
          console.log(err);
        });
  }

  openEditDrinkList(index: number): void {
    const modalRef =
        this.modalService.open(CreateListDrinkComponent, {size: 'lg'});
    modalRef.componentInstance.isTemplateEdit = false;
    modalRef.componentInstance.selectedDrinkList = this.drinkListings[index];

    modalRef.result.then((updatedDrinklist: Drinklist) => {
      this.drinkListings[index] = updatedDrinklist;
      this.drinkListingConvertToView();
      this.fileService.updateFile(
          '/getraenkelisten.json', JSON.stringify(this.drinkListings));
    }, (err) => {});
  }

  deleteDrinkList(index: number) {
    const modalRef =
        this.modalService.open(NotificationComponent, {size: 'lg'});

    modalRef.componentInstance.headline = 'Getränkeliste löschen';
    modalRef.componentInstance.description =
        'Wollen Sie wirklich diese Getränkeliste löschen?';

    modalRef.result.then((result) => {
      this.drinkListings.splice(index, 1);
      this.drinkListViews.splice(index, 1);
      this.fileService.updateFile(
          '/getraenkelisten.json', JSON.stringify(this.drinkListings));
    }, (err) => {});
  }

  openDrinklistCalculater(index: number) {
    const modalRef = this.modalService.open(
        ListDrinkCalculaterComponent, {windowClass: 'my-custom-modal-width'});
    modalRef.componentInstance.selectedDrinkList = this.drinkListings[index];
    modalRef.result.then((result: Drinklist) => {
      this.drinkListings[index] = result;
      this.fileService.updateFile(
          '/getraenkelisten.json', JSON.stringify(this.drinkListings));
      this.getDrinkListingFromJson();
    }, (err) => {});
  }

  addToList(index: number) {
    this.bindingList.push(index);
  }

  removeFromList(index: number) {
    this.bindingList.splice(this.bindingList.indexOf(index), 1);
  }

  createSummaryList() {
    const summaryList: Drinklist = new Drinklist();

    // Initial werden die Daten aus dem erstem gewählten Liste genommen
    summaryList.creator = this.drinkListings[this.bindingList[0]].creator;
    summaryList.startDate = this.drinkListings[this.bindingList[0]].startDate;
    summaryList.endDate = this.drinkListings[this.bindingList[0]].endDate;

    this.bindingList.forEach((listNumber: number, index: number) => {
      // Startdatum und Enddatum festlegen
      if (summaryList.startDate['year'] >=
              this.drinkListings[listNumber].startDate['year'] &&
          summaryList.startDate['month'] >=
              this.drinkListings[listNumber].startDate['month'] &&
          summaryList.startDate['day'] >
              this.drinkListings[listNumber].startDate['day']) {
        summaryList.startDate = this.drinkListings[listNumber].startDate;
      }

      if (summaryList.endDate['year'] <=
              this.drinkListings[listNumber].endDate['year'] &&
          summaryList.endDate['month'] <=
              this.drinkListings[listNumber].endDate['month'] &&
          summaryList.endDate['day'] <
              this.drinkListings[listNumber].endDate['day']) {
        summaryList.endDate = this.drinkListings[listNumber].endDate;
      }

      // Füge alle Getränke zusammen
      summaryList.drinks.push(...this.drinkListings[listNumber].drinks);

      summaryList.drinks = summaryList.drinks.filter(
          (thing, i, arr) =>
              arr.findIndex(
                  t => JSON.stringify(t) === JSON.stringify(thing)) === i);

      // Füge alle Personen zusammen
      summaryList.users.push(...this.drinkListings[listNumber].users);

      summaryList.users = summaryList.users.filter(
          (thing, i, arr) =>
              arr.findIndex(
                  t => JSON.stringify(t) === JSON.stringify(thing)) === i);
    });

    summaryList.quantityOfDrinkToPerson = [];
    summaryList.drinks.forEach((drink: Drink) => {
      const currentList: Calculation[] = [];
      summaryList.users.forEach((person: Person) => {
        currentList.push(new Calculation(0, person, drink));
      });
      summaryList.quantityOfDrinkToPerson.push(currentList);
    });

    this.bindingList.forEach((listNumber: number, index: number) => {
      // Bei gleichem Getränk und Person eine Calculation wird die Anzahl dazu
      // addiert
      summaryList.quantityOfDrinkToPerson.forEach(
          (calculationsSummaryList: Calculation[], i) => {
            calculationsSummaryList.forEach(
                (calculationSummaryList: Calculation, j) => {
                  this.drinkListings[listNumber]
                      .quantityOfDrinkToPerson.forEach(
                          (calculationsDrinkList: Calculation[]) => {
                            calculationsDrinkList.forEach(
                                (calculationDrinkList: Calculation) => {
                                  if (JSON.stringify(
                                          calculationSummaryList.drink) ===
                                          JSON.stringify(
                                              calculationDrinkList.drink) &&
                                      JSON.stringify(
                                          calculationSummaryList.person) ===
                                          JSON.stringify(
                                              calculationDrinkList.person)) {
                                    summaryList.quantityOfDrinkToPerson[i][j]
                                        .quantity +=
                                        +calculationDrinkList.quantity;
                                  }
                                });
                          });
                });
          });
    });

    console.log('BINDRESULT: ', summaryList);
    this.drinkListings.push(summaryList);
    this.fileService.updateFile(
        '/getraenkelisten.json', JSON.stringify(this.drinkListings));
    this.getDrinkListingFromJson();
  }
}
