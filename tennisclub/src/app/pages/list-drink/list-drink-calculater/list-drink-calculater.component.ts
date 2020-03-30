import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {FileService} from './../../../file.service';
import {Calculation} from './../../../models/drink/calculation.model';
import {Drink} from './../../../models/drink/drink.model';
import {Drinklist} from './../../../models/drink/drinklist.model';
import {Person} from './../../../models/person/person.model';

@Component({
  selector: 'app-list-drink-calculater',
  templateUrl: './list-drink-calculater.component.html',
  styleUrls: ['./list-drink-calculater.component.css']
})
export class ListDrinkCalculaterComponent implements OnInit {
  selectedDrinkList: Drinklist;

  public calculations: Array<Array<Calculation>>;
  public currentTotalCost: number;
  public sumX: number[];
  public sumY: number[];
  constructor(
      public activeModal: NgbActiveModal, private fileService: FileService) {}

  ngOnInit() {
    this.buildCalculations();
  }

  private buildCalculations(): void {
    if (!this.calculations) {
      this.calculations = [];
    }

    this.selectedDrinkList.users.forEach((user, i) => {
      if (!this.calculations[i]) {
        this.calculations[i] = [];
      }

      this.selectedDrinkList.drinks.forEach((drink, j) => {
        if (!this.calculations[i][j] ||
            JSON.stringify(this.calculations[i][j].person) !==
                JSON.stringify(user) ||
            JSON.stringify(this.calculations[i][j].drink) !==
                JSON.stringify(drink)) {
          this.calculations[i][j] = {
            quantity: this.selectedDrinkList.quantityOfDrinkToPerson[i][j].quantity,
            person: user,
            drink: drink
          };
        }
      });
    });
    this.calculateCost();
  }

  public change(event) {
    this.calculateCost();
  }

  private calculateCost(): void {
    this.currentTotalCost = 0;
    this.sumX = [];
    this.sumY = [];
    this.calculations.forEach((row, i) => {
      let y = 0;
      row.forEach((calculation: Calculation, j) => {
        this.currentTotalCost += calculation.drink.price * calculation.quantity;
        y += calculation.quantity * calculation.drink.price;
        if (!this.sumX[j]) {
          this.sumX[j] = 0;
        }
        this.sumX[j] += calculation.quantity * calculation.drink.price;
      });
      this.sumY.push(y);
    });
  }

  public saveCalculation() {
    this.selectedDrinkList.quantityOfDrinkToPerson = this.calculations;
    this.selectedDrinkList.totalCost = this.currentTotalCost;
    this.activeModal.close(this.selectedDrinkList);
  }

  private isNaturalNumber(str) {
    const pattern = /^([0-9]\d*)$/;
    return pattern.test(str);
  }
}
