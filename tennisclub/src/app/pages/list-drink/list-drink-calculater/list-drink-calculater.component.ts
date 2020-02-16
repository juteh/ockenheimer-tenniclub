import {Component, Input, OnInit} from '@angular/core';

import {Calculation} from './../../../models/drink/calculation.model';
import {Drinklist} from './../../../models/drink/drinklist.model';

@Component({
  selector: 'app-list-drink-calculater',
  templateUrl: './list-drink-calculater.component.html',
  styleUrls: ['./list-drink-calculater.component.css']
})
export class ListDrinkCalculaterComponent implements OnInit {
  @Input() selectedDrinkList: Drinklist;

  public calculations: Array<Array<Calculation>>;
  public currentTotalCost: number;
  constructor() {}

  ngOnInit() {
    this.calculations = this.selectedDrinkList.quantityOfDrinkToPerson;
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
          this.calculations[i][j] = {quantity: 0, person: user, drink: drink};
        }
      });
    });
    this.calculateTotalCost();
  }

  public change(event, i, j) {
    if (!this.isNaturalNumber(event.target.value + '')) {
      event.target.value = 0;
    }
    this.calculations[i][j].quantity = event.target.value;
    this.calculateTotalCost();
  }

  private calculateTotalCost(): void {
    this.currentTotalCost = 0;
    this.calculations.forEach((row, i) => {
      row.forEach((calculation: Calculation, j) => {
        this.currentTotalCost += calculation.drink.price * calculation.quantity;
      });
    });
  }

  private isNaturalNumber(str) {
    const pattern = /^([0-9]\d*)$/;
    return pattern.test(str);
  }
}
