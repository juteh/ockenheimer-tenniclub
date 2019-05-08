import { Drink } from './drink.model';
import { Member } from './../member/member.model';
export class Drinklist {
  public id: number;
  public users: Member[];
  public drink: Drink[];
  public startDate: string;
  public endtDate: string;
  public creator: Member;
  public totalCost: string;
}
