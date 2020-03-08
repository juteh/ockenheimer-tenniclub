import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {NotificationComponent} from '../../../components/notification/notification.component';
import {FileService} from '../../../file.service';
import {Drinklist} from '../../../models/drink/drinklist.model';
import {CreateListDrinkTemplateComponent} from '../create-list-drink-template/create-list-drink-template.component';

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
}
