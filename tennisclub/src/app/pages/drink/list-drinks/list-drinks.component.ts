import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {DrinklistTemplate} from '../../../models/drink/drinklist-template.model';

import {NotificationComponent} from './../../../components/notification/notification.component';
import {FileService} from './../../../file.service';
import {Drinklist} from './../../../models/drink/drinklist.model';
import {EditListDrinkComponent} from './../edit-list-drink/edit-list-drink.component';
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
  public loading = true;
  public searchText: string;

  constructor(
      private fileService: FileService, private modalService: NgbModal) {
    this.getDrinkListingFromJson();
  }

  ngOnInit(): void {}

  // Lädt die Getränkeliste aus dem JSON und schreibt driekt ViewItems
  getDrinkListingFromJson(): void {
    this.fileService.getFile('/getraenkeliste.json')
        .then((drinkListings) => {
          this.drinkListings = JSON.parse(drinkListings);

          this.drinkListingConvertToView();
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
  }

  drinkListingConvertToView(): void {
    for (const drinkListing of this.drinkListings) {
      console.log(drinkListing);
      if (drinkListing.creator) {
        const name =
            drinkListing.creator.firstname + ' ' + drinkListing.creator.lastname;
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
    this.loading = true;
    const modalRef =
        this.modalService.open(EditListDrinkComponent, {size: 'lg'});
    modalRef.componentInstance.isTemplate = false;
    modalRef.result.then(
        (drinklist: Drinklist) => {
          this.drinkListings.push(drinklist);
          this.fileService.updateFile(
              '/getraenkeliste.json', JSON.stringify(this.drinkListings));
          this.drinkListingConvertToView();
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          console.log(err);
        });
  }

  openCreateTemplateDrinklist(): void {
    const modalRef =
        this.modalService.open(EditListDrinkComponent, {size: 'lg'});
    modalRef.componentInstance.isTemplate = true;
    modalRef.result.then(
        (drinklistSetting: DrinklistTemplate) => {
          this.fileService.updateFile(
              '/getraenkeliste-settings.json',
              JSON.stringify(drinklistSetting));
        },
        (err) => {
          console.log(err);
        });
  }

  openEditDrinkList(index: number): void {
    this.loading = true;
    const modalRef =
        this.modalService.open(EditListDrinkComponent, {size: 'lg'});
    modalRef.componentInstance.isTemplate = false;
    modalRef.componentInstance.selectedDrinkList = this.drinkListings[index];

    modalRef.result.then(
        (updatedDrinklist: Drinklist) => {
          this.drinkListings[index] = updatedDrinklist;
          this.drinkListingConvertToView();
          this.fileService.updateFile(
              '/getraenkeliste.json', JSON.stringify(this.drinkListings));
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        });
  }

  deleteDrinkList(index: number) {
    const modalRef =
        this.modalService.open(NotificationComponent, {size: 'lg'});

    modalRef.componentInstance.headline = 'Getränkeliste löschen';
    modalRef.componentInstance.description =
        'Wollen Sie wirklich diese Getränkeliste löschen?';
    this.loading = true;

    modalRef.result.then(
        (result) => {
          this.drinkListings.splice(index, 1);
          this.drinkListViews.splice(index, 1);
          this.fileService.updateFile(
              '/getraenkeliste.json', JSON.stringify(this.drinkListings));
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        });
  }
}
