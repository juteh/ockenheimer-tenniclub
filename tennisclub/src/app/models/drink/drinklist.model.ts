import {Person} from '../person/person.model';
import {Drink} from './drink.model';

export class Drinklist {
  public id: number;
  public creator: Person;
  public startDate: Date;
  public endDate: Date;
  public users: Person[];
  public drinks: Drink[];
  public totalCost: number;

  constructor(
      id = null, creator = null, startDate = null, endDate = null, users = [],
      drinks = [], totalcost = 0) {
    this.id = id;
    this.creator = creator;
    this.startDate = startDate;
    this.endDate = endDate;
    this.users = users;
    this.drinks = drinks;
    this.totalCost = totalcost;
  }
}
