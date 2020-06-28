import 'jspdf-autotable';

import {summaryFileName} from '@angular/compiler/src/aot/util';
import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as jsPDF from 'jspdf';
import {Drink} from 'src/app/models/drink/drink.model';

import {NotificationComponent} from '../../../components/notification/notification.component';
import {FileService} from '../../../file.service';
import {Drinklist} from '../../../models/drink/drinklist.model';

import {Calculation} from './../../../models/drink/calculation.model';
import {Person} from './../../../models/person/person.model';
import {CreateListDrinkComponent} from './../create-list-drink/create-list-drink.component';
import {ListDrinkCalculaterComponent} from './../list-drink-calculater/list-drink-calculater.component';
import {DrinkListView} from './drink-list-view';
import {ExportModalComponent} from './export-modal/export-modal.component';


@Component({
  selector: 'app-list-drinks',
  templateUrl: './list-drinks.component.html',
  styleUrls: ['./list-drinks.component.css']
})
export class ListDrinksComponent implements OnInit {
  private drinkListings: Drinklist[] = [];
  private summaryListings: Drinklist[] = [];
  // Für das Suchen muss die Drinkliste, die einzelnen Parameter zu Strings
  // zusammen gebracht werden
  public drinkListViews: DrinkListView[] = [];
  public summaryListViews: DrinkListView[] = [];
  public searchTextSummaryList: string;
  public searchTextDrinkList: string;
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
          this.drinkListings =
              JSON.parse(drinkListings).filter(dl => !dl.isSummaryList);
          this.summaryListings =
              JSON.parse(drinkListings).filter(dl => dl.isSummaryList);
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
    this.summaryListViews = [];
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

      const totalCost = drinkListing.totalCost.toFixed(2) + ' €';

      this.drinkListViews.push(new DrinkListView(
          drinkListing.id + '', name, time, totalCost,
          drinkListing.isSummaryList));
    }

    for (const summaryListing of this.summaryListings) {
      let name = 'Keiner gewählt';
      if (summaryListing.creator) {
        name = summaryListing.creator.firstname + ' ' +
            summaryListing.creator.lastname;
      }
      let startDate = '';

      if (summaryListing.startDate) {
        startDate = summaryListing.startDate['day'] + '.' +
            summaryListing.startDate['month'] + '.' +
            summaryListing.startDate['year'];
      }

      let endDate = '';
      if (summaryListing.endDate) {
        endDate = summaryListing.endDate['day'] + '.' +
            summaryListing.endDate['month'] + '.' +
            summaryListing.endDate['year'];
      }

      const time = startDate + ' - ' + endDate;

      const totalCost = summaryListing.totalCost.toFixed(2) + ' €';

      this.summaryListViews.push(new DrinkListView(
          summaryListing.id + '', name, time, totalCost,
          summaryListing.isSummaryList));
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

  openEditDrinkList(index: number, isSummaryList: boolean): void {
    console.log("isSummaryList: ", isSummaryList);
    console.log("index: ", index);
    const modalRef =
        this.modalService.open(CreateListDrinkComponent, {size: 'lg'});
    modalRef.componentInstance.isTemplateEdit = false;
    if (isSummaryList) {
      modalRef.componentInstance.selectedDrinkList =
          this.summaryListings[index];
    } else {
      modalRef.componentInstance.selectedDrinkList = this.drinkListings[index];
    }

    modalRef.result.then((updatedDrinklist: Drinklist) => {
      if (isSummaryList) {
        this.summaryListings[index] = updatedDrinklist;
        this.summaryListings[index].isSummaryList = true;
      } else {
        this.drinkListings[index] = updatedDrinklist;
        this.drinkListings[index].isSummaryList = false;
      }

      const currentDrinkListing = this.drinkListings;
      currentDrinkListing.push(...this.summaryListings);

      this.fileService.updateFile(
          '/getraenkelisten.json', JSON.stringify(currentDrinkListing));
      this.getDrinkListingFromJson();
    }, (err) => {});
  }

  deleteDrinkList(index: number, isSummaryList: boolean) {
    const modalRef =
        this.modalService.open(NotificationComponent, {size: 'lg'});

    modalRef.componentInstance.headline = 'Getränkeliste löschen';
    modalRef.componentInstance.description =
        'Wollen Sie wirklich diese Getränkeliste löschen?';

    modalRef.result.then((result) => {
      if (isSummaryList) {
        this.summaryListings.splice(index, 1);
        this.summaryListViews.splice(index, 1);
      } else {
        this.drinkListings.splice(index, 1);
        this.drinkListViews.splice(index, 1);
      }

      const currentDrinkListing = this.drinkListings;
      currentDrinkListing.push(...this.summaryListings);

      this.fileService.updateFile(
          '/getraenkelisten.json', JSON.stringify(currentDrinkListing));
      this.getDrinkListingFromJson();
    }, (err) => {});
  }

  openDrinklistCalculater(index: number, isSummaryList: boolean) {
    if (!isSummaryList) {
      const modalRef = this.modalService.open(
          ListDrinkCalculaterComponent,
          {windowClass: 'my-custom-modal-calculater'});
      modalRef.componentInstance.selectedDrinkList = this.drinkListings[index];

      modalRef.result.then((result: Drinklist) => {
        this.drinkListings[index] = result;

        const currentDrinkListing = this.drinkListings;
        currentDrinkListing.push(...this.summaryListings);

        this.fileService.updateFile(
            '/getraenkelisten.json', JSON.stringify(currentDrinkListing));
        this.getDrinkListingFromJson();
      }, (err) => {});
    } else {
      const modalRef = this.modalService.open(
          ListDrinkCalculaterComponent, {windowClass: 'my-custom-modal-width'});
      modalRef.componentInstance.selectedDrinkList =
          this.summaryListings[index];

      modalRef.result.then((result: Drinklist) => {
        this.summaryListings[index] = result;

        const currentDrinkListing = this.drinkListings;
        currentDrinkListing.push(...this.summaryListings);

        this.fileService.updateFile(
            '/getraenkelisten.json', JSON.stringify(currentDrinkListing));
        this.getDrinkListingFromJson();
      }, (err) => {});
    }
  }

  addToList(index: number) {
    this.bindingList.push(index);
  }

  removeFromList(index: number) {
    this.bindingList.splice(this.bindingList.indexOf(index), 1);
  }

  createSummaryList() {
    const summaryList: Drinklist = new Drinklist();

    let totalCost = 0;
    this.bindingList.forEach((listNumber: number, index: number) => {
      // Initial werden die Daten aus dem erstem gewählten Liste genommen
      if (!summaryList.creator) {
        summaryList.creator = this.drinkListings[listNumber].creator;
      }
      if (!summaryList.startDate) {
      summaryList.startDate = this.drinkListings[listNumber].startDate;
      }
      if (!summaryList.endDate) {
      summaryList.endDate = this.drinkListings[listNumber].endDate;
      }
      // Gesamtsumme festlegen
      totalCost += this.drinkListings[listNumber].totalCost;
      // Startdatum und Enddatum festlegen
      let summaryListStartDate = null;
      if (summaryList.startDate && summaryList.startDate['year'] &&
          summaryList.startDate['month'] && summaryList.startDate['day']) {
        summaryListStartDate = new Date(
            summaryList.startDate['year'], summaryList.startDate['month'],
            summaryList.startDate['day']);
      }

      let drinkListStartDate = null;
      if (this.drinkListings[listNumber].startDate &&
          this.drinkListings[listNumber].startDate['year'] &&
          this.drinkListings[listNumber].startDate['month'] &&
          this.drinkListings[listNumber].startDate['day']) {
        drinkListStartDate = new Date(
            this.drinkListings[listNumber].startDate['year'],
            this.drinkListings[listNumber].startDate['month'],
            this.drinkListings[listNumber].startDate['day']);
      }

      if (summaryListStartDate && drinkListStartDate) {
        if (summaryListStartDate > drinkListStartDate) {
          summaryList.startDate = this.drinkListings[listNumber].startDate;
        }
      }

      // if (!summaryList.startDate || !summaryList.startDate['year'] ||
      //     !summaryList.startDate['month'] || !summaryList.startDate['day']) {
      //   summaryList.startDate = this.drinkListings[listNumber].startDate;
      // } else if (
      //     this.drinkListings[listNumber].startDate &&
      //     this.drinkListings[listNumber].startDate['year'] &&
      //     this.drinkListings[listNumber].startDate['month'] &&
      //     this.drinkListings[listNumber].startDate['day'] &&
      //     (summaryList.startDate['year'] >=
      //          this.drinkListings[listNumber].startDate['year'] &&
      //      summaryList.startDate['month'] >=
      //          this.drinkListings[listNumber].startDate['month'] &&
      //      summaryList.startDate['day'] >
      //          this.drinkListings[listNumber].startDate['day'])) {
      //   summaryList.startDate = this.drinkListings[listNumber].startDate;
      // }

      let summaryListEndDate = null;
      if (summaryList.endDate && summaryList.endDate['year'] &&
          summaryList.endDate['month'] && summaryList.endDate['day']) {
        summaryListEndDate = new Date(
            summaryList.endDate['year'], summaryList.endDate['month'],
            summaryList.endDate['day']);
      }

      let drinkListEndDate = null;
      if (this.drinkListings[listNumber].endDate &&
          this.drinkListings[listNumber].endDate['year'] &&
          this.drinkListings[listNumber].endDate['month'] &&
          this.drinkListings[listNumber].endDate['day']) {
        drinkListEndDate = new Date(
            this.drinkListings[listNumber].endDate['year'],
            this.drinkListings[listNumber].endDate['month'],
            this.drinkListings[listNumber].endDate['day']);
      }

      if (summaryListEndDate && drinkListEndDate) {
        if (summaryListEndDate < drinkListEndDate) {
          summaryList.endDate = this.drinkListings[listNumber].endDate;
        }
      }

      // if (!summaryList.endDate || !summaryList.endDate['year'] ||
      //     !summaryList.endDate['month'] || !summaryList.endDate['day']) {
      //   summaryList.endDate = this.drinkListings[listNumber].endDate;
      // } else if (
      //     summaryList.endDate && summaryList.endDate['year'] &&
      //     summaryList.endDate['month'] && summaryList.endDate['day'] &&
      //     this.drinkListings[listNumber].endDate &&
      //     this.drinkListings[listNumber].endDate['year'] &&
      //     this.drinkListings[listNumber].endDate['month'] &&
      //     this.drinkListings[listNumber].endDate['day'] &&
      //     (summaryList.endDate['year'] <=
      //          this.drinkListings[listNumber].endDate['year'] &&
      //      summaryList.endDate['month'] <=
      //          this.drinkListings[listNumber].endDate['month'] &&
      //      summaryList.endDate['day'] <
      //          this.drinkListings[listNumber].endDate['day'])) {
      //   summaryList.endDate = this.drinkListings[listNumber].endDate;
      // }

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
    summaryList.users.forEach((person: Person) => {
      const currentList: Calculation[] = [];
      summaryList.drinks.forEach((drink: Drink) => {
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
                                    let quantity =
                                        +summaryList
                                             .quantityOfDrinkToPerson[i][j]
                                             .quantity;
                                    quantity += +calculationDrinkList.quantity;

                                    summaryList.quantityOfDrinkToPerson[i][j]
                                        .quantity = +quantity;
                                  }
                                });
                          });
                });
          });
    });
    summaryList.totalCost = totalCost;
    summaryList.isSummaryList = true;
    this.summaryListings.push(summaryList);

    const currentDrinkListing = this.drinkListings;
    summaryList.id = currentDrinkListing[currentDrinkListing.length - 1].id + 1;
    currentDrinkListing.push(...this.summaryListings);
    this.bindingList = [];
    this.fileService.updateFile(
        '/getraenkelisten.json', JSON.stringify(currentDrinkListing));
    this.getDrinkListingFromJson();
  }

  exportPDF(index: number, isSummaryList: boolean): void {
    let currentDrinkList = null;
    if (!isSummaryList) {
      currentDrinkList = this.drinkListings[index];
    } else {
      currentDrinkList = this.summaryListings[index];
    }
    const modalRef = this.modalService.open(ExportModalComponent);

    modalRef.componentInstance.drinkListTemplate = this.drinkListTemplate;
    modalRef.result.then(
        (isSummary: boolean) => {
          if (isSummary) {
            this.createSummaryListExport(currentDrinkList);

          } else {
            this.createDetailListExport(currentDrinkList);
          }
        },
        (err) => {
          console.log(err);
        });
  }

  createSummaryListExport(currentDrinkList: Drinklist) {
    const doc = new jsPDF('l');

    const head = [[], []];
    const body = [];

    // Erstelle Head der Tabelle
    if (currentDrinkList.startDate) {
      head[0].push(`von: ${
          currentDrinkList.startDate['day'] + '.' +
          currentDrinkList.startDate['month'] + '.' +
          currentDrinkList.startDate['year']}`);
    } else {
      head[0].push(``);
    }

    if (currentDrinkList.endDate) {
      head[1].push(`bis: ${
          currentDrinkList.endDate['day'] + '.' +
          currentDrinkList.endDate['month'] + '.' +
          currentDrinkList.endDate['year']}`);
    } else {
      head[1].push(``);
    }

    head[0].push(`Summe`);

    // Erstelle Body der Tabelle
    currentDrinkList.users.forEach((person: Person, index: number) => {
      body.push([]);
      if (person.isGuest) {
        body[index].push(`${person.firstname} ${person.lastname} (Gast)`);
      } else {
        body[index].push(`${person.firstname} ${person.lastname}`);
      }
    });

    // Summe pro Person erstellen
    currentDrinkList.quantityOfDrinkToPerson.forEach(
        (calculations: Calculation[], i: number) => {
          let valueRow = 0;
          calculations.forEach((calculation: Calculation, j: number) => {
            valueRow += calculation.quantity * calculation.drink.price;
          });
          body[i].push(`${valueRow.toFixed(2)}€`);
        });

    // Summe definieren
    body.push([]);
    body[body.length - 1].push('Summe');
    body[body.length - 1].push(`${currentDrinkList.totalCost.toFixed(2)}€`);


    doc.autoTable({
      head: head,
      body: body,
    });

    doc.save('table.pdf');
  }

  createDetailListExport(currentDrinkList: Drinklist) {
    const doc = new jsPDF('l');

    const head = [[], [], []];
    const body = [];
    // Erstelle Head der Tabelle
    if (currentDrinkList.creator) {
    if (currentDrinkList.creator.isGuest) {
      head[0].push(`${currentDrinkList.creator.firstname} ${currentDrinkList.creator.lastname} (Gast)`);
    } else {
      head[0].push(`${currentDrinkList.creator.firstname} ${currentDrinkList.creator.lastname}`);
    }
  } else {
    head[0].push(``);
  }

    if (currentDrinkList.startDate) {
      head[1].push(`von: ${
          currentDrinkList.startDate['day'] + '.' +
          currentDrinkList.startDate['month'] + '.' +
          currentDrinkList.startDate['year']}`);
    } else {
      head[1].push(``);
    }

    if (currentDrinkList.endDate) {
      head[2].push(`bis: ${
          currentDrinkList.endDate['day'] + '.' +
          currentDrinkList.endDate['month'] + '.' +
          currentDrinkList.endDate['year']}`);
    } else {
      head[2].push(``);
    }

    currentDrinkList.drinks.forEach((drink: Drink) => {
      head[0].push(``);
      head[1].push(`${drink.name}`);
      head[2].push(`${drink.price.toFixed(2)}€`);
    });

    head[0].push(``);
    head[1].push(``);
    head[2].push(`Summe`);


    // Erstelle Body der Tabelle
    currentDrinkList.users.forEach((person: Person, index: number) => {
      body.push([]);
      if (person.isGuest) {
        body[index].push(`${person.firstname} ${person.lastname} (Gast)`);
      } else {
        body[index].push(`${person.firstname} ${person.lastname}`);
      }
    });

    currentDrinkList.quantityOfDrinkToPerson.forEach(
        (calculations: Calculation[], i: number) => {
          calculations.forEach((calculation: Calculation, j: number) => {
            body[i].push(calculation.quantity);
          });
        });

    currentDrinkList.quantityOfDrinkToPerson.forEach(
        (calculations: Calculation[], i: number) => {
          let valueRow = 0;
          calculations.forEach((calculation: Calculation, j: number) => {
            valueRow += calculation.quantity * calculation.drink.price;
          });
          body[i].push(`${valueRow.toFixed(2)}€`);
        });

    // Summe definieren
    body.push([]);
    body[body.length - 1].push('Summe');
    currentDrinkList.drinks.forEach((drink: Drink, i: number) => {
      let valueCol = 0;
      currentDrinkList.users.forEach((person: Person, j: number) => {
        valueCol += drink.price *
            currentDrinkList.quantityOfDrinkToPerson[j][i].quantity;
      });
      body[body.length - 1].push(`${valueCol.toFixed(2)}€`);
    });
    body[body.length - 1].push(`${currentDrinkList.totalCost.toFixed(2)}€`);

    doc.autoTable({
      head: head,
      body: body,
    });

    doc.save('table.pdf');
  }
}
