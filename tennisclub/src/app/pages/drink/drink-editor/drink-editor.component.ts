import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BrowserWindow} from 'electron';

import {NotificationComponent} from './../../../components/notification/notification.component';
import {FileService} from './../../../file.service';
import {Drink} from './../../../models/drink/drink.model';
import {Drinklist} from './../../../models/drink/drinklist.model';
import {EditDrinkComponent} from './edit-drink/edit-drink.component';

@Component({
  selector: 'app-drink-editor',
  templateUrl: './drink-editor.component.html',
  styleUrls: ['./drink-editor.component.css']
})
export class DrinkEditorComponent implements OnInit {
  public drinks: Drink[] = [];
  public drinkViews: any[] = [];


  public searchText: string;

  constructor(
      private fileService: FileService, private modalService: NgbModal) {
    this.getDrinks();
  }

  ngOnInit() {}

  getDrinks() {
    this.drinks = [];
    this.drinkViews = [];
    this.fileService.getFile('/getraenke.json')
        .then((drinks) => {
          this.drinks = JSON.parse(drinks);
          console.log('drinks: ', drinks);
          this.drinks.forEach((drink: Drink) => {
            this.drinkViews.push({
              id: drink.id,
              name: drink.name,
              description: drink.description,
              liter: drink.liter.toFixed(3),
              price: drink.price.toFixed(2)
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
  }

  openCreateDrink(): void {
    const modalRef = this.modalService.open(EditDrinkComponent, {size: 'lg'});
    modalRef.componentInstance.createMode = true;
    modalRef.result.then(
        (drink: Drink) => {
          if (this.drinks.length === 0) {
            drink.id = 0;
          } else {
            drink.id = this.drinks[this.drinks.length - 1].id + 1;
          }
          this.drinks.push(drink);
          this.fileService
              .updateFile('/getraenke.json', JSON.stringify(this.drinks))
              .then((result) => {
                this.getDrinks();
                this.changeTemplate();
              })
              .catch(err => {});
        },
        (err) => {
          console.log(err);
        });
  }

  openEditDrink(index: number): void {
    const modalRef = this.modalService.open(EditDrinkComponent, {size: 'lg'});
    modalRef.componentInstance.createMode = false;
    modalRef.componentInstance.drink = this.drinks[index];
    modalRef.result.then(
        (editDrink: Drink) => {
          console.log(editDrink);
          this.drinks[index].name = editDrink.name;
          this.drinks[index].description = editDrink.description;
          this.drinks[index].liter = editDrink.liter;
          this.drinks[index].price = editDrink.price;
          this.fileService
              .updateFile('/getraenke.json', JSON.stringify(this.drinks))
              .then((result) => {
                this.getDrinks();
                this.changeTemplate();
              })
              .catch((err) => {});
        },
        (err) => {
          console.log(err);
        });
  }

  deleteDrink(index: number): void {
    const modalRef =
        this.modalService.open(NotificationComponent, {size: 'lg'});
    modalRef.componentInstance.headline = 'Getränk entfernen';
    modalRef.componentInstance.description =
        'Wollen Sie wirklich das Getränk aus der Liste entfernen?';

    modalRef.result.then(
        (result: any) => {
          this.drinks.splice(index, 1);
          this.fileService.updateFile(
              '/getraenke.json', JSON.stringify(this.drinks));
          this.getDrinks();
        },
        (err) => {
          console.log(err);
        });
  }

  /**
   * Die Vorlage muss immer wieder angepasst werden, wenn es Änderungen bei den
   * Getränken gibt
   */
  changeTemplate(): void {
    let drinklistTemplate: Drinklist;
    const newDrinks: Drink[] = [];
    this.fileService.getFile('/getraenkeliste-template.json')
        .then((template) => {
          drinklistTemplate = JSON.parse(template);
          if (drinklistTemplate && drinklistTemplate.drinks) {
            this.drinks.forEach((drink: Drink) => {
              if (drinklistTemplate.drinks.filter(d => drink.id === d.id)
                      .length === 1) {
                newDrinks.push(drink);
              }
            });
            drinklistTemplate.drinks = newDrinks;
            this.fileService.updateFile(
                '/getraenkeliste-template.json',
                JSON.stringify(drinklistTemplate));
          }
        })
        .catch((error) => {
          console.log(error);
        });
  }
}
