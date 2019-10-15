import {Member} from 'src/app/models/member/member.model';
import {Drink} from './drink.model';
export class DrinklistTemplate {
  public creator: Member;
  public startDate: Date;
  public endDate: Date;
  public users: Member[];
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
