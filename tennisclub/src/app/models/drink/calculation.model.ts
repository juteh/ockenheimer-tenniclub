import {Person} from '../person/person.model';
import {Drink} from './drink.model';

export class Calculation {
  public quantity: number;
  public person: Person;
  public drink: Drink;

  constructor(quantity = 0, person = null, drink = null) {
    this.quantity = quantity;
    this.person = person;
    this.drink = drink;
  }
}
