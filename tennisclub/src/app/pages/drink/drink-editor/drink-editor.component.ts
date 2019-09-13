import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BrowserWindow} from 'electron';

import {NotificationComponent} from './../../../components/notification/notification.component';
import {FileService} from './../../../file.service';
import {Drink} from './../../../models/drink/drink.model';
import {EditDrinkComponent} from './edit-drink/edit-drink.component';

@Component({
  selector: 'app-drink-editor',
  templateUrl: './drink-editor.component.html',
  styleUrls: ['./drink-editor.component.css']
})
export class DrinkEditorComponent implements OnInit {
  public drinks: Drink[] = [];

  public searchText: string;
  // Das Reload braucht der Filter damit er neue ergebnisse bekommt TODO: Lösung finden ohne reload
  public loading = true;

  constructor(
      private fileService: FileService, private modalService: NgbModal) {
    this.fileService.getFile('/getraenke.json')
        .then((drinks) => {
          this.drinks = JSON.parse(drinks);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
  }

  ngOnInit() {}

  openCreateDrink(): void {
    const modalRef = this.modalService.open(EditDrinkComponent, {size: 'lg'});
    modalRef.componentInstance.createMode = true;
    this.loading = true;
    modalRef.result.then(
        (drink: Drink) => {
          if (this.drinks.length === 0) {
            drink.id = 0;
          } else {
            drink.id = this.drinks[this.drinks.length - 1].id + 1;
          }
          this.drinks.push(drink);
          this.fileService.updateFile(
              '/getraenke.json', JSON.stringify(this.drinks));
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          console.log(err);
        });
  }

  openEditDrink(drink: Drink, index: number): void {
    const modalRef = this.modalService.open(EditDrinkComponent, {size: 'lg'});
    modalRef.componentInstance.createMode = false;
    modalRef.componentInstance.drink = drink;
    this.loading = true;
    modalRef.result.then(
        (editDrink: Drink) => {
          this.drinks[index].name = editDrink.name;
          this.drinks[index].description = editDrink.description;
          this.drinks[index].litres = editDrink.litres;
          this.drinks[index].price = editDrink.price;
          this.fileService.updateFile(
              '/getraenke.json', JSON.stringify(this.drinks));
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          console.log(err);
        });
  }

  deleteDrink(index: number): void {
    const modalRef =
        this.modalService.open(NotificationComponent, {size: 'lg'});
    modalRef.componentInstance.headline = 'Getränk entfernen';
    modalRef.componentInstance.description =
        'Wollen Sie wirklich das Getränk aus der Liste entfernen?';

    this.loading = true;
    modalRef.result.then(
        (result: any) => {
          this.drinks.splice(index, 1);
          this.fileService.updateFile(
              '/getraenke.json', JSON.stringify(this.drinks));
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          console.log(err);
        });
  }
}
