import {Person} from '../person/person.model';
import {Drink} from './drink.model';
import { Calculation } from './calculation.model';

export class Drinklist {
  public id: number;
  public creator: Person;
  public startDate: Date;
  public endDate: Date;
  public users: Person[];
  public drinks: Drink[];
  public totalCost: number;
  // Drink x- und Person y-Achse
  public quantityOfDrinkToPerson: Array<Array<Calculation>>;

  constructor(
      id = null, creator = null, startDate = null, endDate = null, users = [],
      drinks = [], totalcost = 0, quantityOfDrinkToPerson = null) {
    this.id = id;
    this.creator = creator;
    this.startDate = startDate;
    this.endDate = endDate;
    this.users = users;
    this.drinks = drinks;
    this.totalCost = totalcost;
    this.quantityOfDrinkToPerson = quantityOfDrinkToPerson;
  }
}
