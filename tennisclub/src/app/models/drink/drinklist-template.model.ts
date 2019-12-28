import {Person} from 'src/app/models/person/person.model';
import {Drink} from './drink.model';
export class DrinklistTemplate {
  public creator: Person;
  public startDate: Date;
  public endDate: Date;
  public users: Person[];
  public drinks: Drink[];

  constructor(
      creator = null, startDate = null, endDate = null, users = [],
      drinks = []) {
    this.creator = creator;
    this.startDate = startDate;
    this.endDate = endDate;
    this.users = users;
    this.drinks = drinks;
  }
}
