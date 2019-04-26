import { Salutation } from './salutation.enum';


export class Member {
  public id: number;
  public firstname: string;
  public lastname: string;
  public street: string;
  public housenumber: number;
  public postcode: string;
  public city: string;
  public birthdate: Date;
  public phone: string;
  public salutation: Salutation;
  public age: number;
  public startMembership: Date;
  public membershipYears: number;
  public active: boolean;
  public guest: boolean;
}
