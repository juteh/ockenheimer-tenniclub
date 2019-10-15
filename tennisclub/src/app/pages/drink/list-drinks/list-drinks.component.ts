import { NotificationComponent } from './../../../components/notification/notification.component';
import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {FileService} from './../../../file.service';
import {Drinklist} from './../../../models/drink/drinklist.model';
import {DrinklistTemplate} from '../../../models/drink/drinklist-template.model';
import {EditListDrinkComponent} from './../edit-list-drink/edit-list-drink.component';


@Component({
  selector: 'app-list-drinks',
  templateUrl: './list-drinks.component.html',
  styleUrls: ['./list-drinks.component.css']
})
export class ListDrinksComponent implements OnInit {
  public drinklistings: Drinklist[] = [];
  public loading = true;
  public searchText: string;

  constructor(
      private fileService: FileService, private modalService: NgbModal) {
    this.fileService.getFile('/getraenkeliste.json')
        .then((drinklistings) => {
          this.drinklistings = JSON.parse(drinklistings);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
  }

  ngOnInit(): void {}

  openCreateDrinklist(): void {
    const modalRef =
        this.modalService.open(EditListDrinkComponent, {size: 'lg'});
        modalRef.componentInstance.isTemplate = false;
    modalRef.result.then(
        (drinklist: Drinklist) => {
          this.drinklistings.push(drinklist);
          this.fileService.updateFile(
              '/getraenkeliste.json',
              JSON.stringify(this.drinklistings));
        },
        (err) => {
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

  openEditDrinkList(drinkList: Drinklist, index: number): void {
    const modalRef = this.modalService.open(EditListDrinkComponent, {size: 'lg'});
    modalRef.componentInstance.isTemplate = false;
    this.loading = true;

    modalRef.result.then(
        (updatedDrinklist: Drinklist) => {
          this.drinklistings[index] = updatedDrinklist;
          this.fileService.updateFile('/getraenkeliste.json', JSON.stringify(this.drinklistings));
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
            this.drinklistings.splice(index, 1);
            this.fileService.updateFile('/getraenkeliste.json', JSON.stringify(this.drinklistings));
            this.loading = false;
          },
          (err) => {
            this.loading = false;
          });
  }
}
