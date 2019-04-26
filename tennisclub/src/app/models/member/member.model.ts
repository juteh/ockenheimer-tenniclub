import { Salutation } from './salutation.enum';


export class Member {
  public id: number;
  public firstname: string;
  public lastname: string;
  public street: string;
  public housenumber: string;
  public postcode: string;
  public city: string;
  public birthdate: string;
  public phone: string;
  public salutation: Salutation;
  public age: number;
  public startMembership: string;
  public membershipYears: number;
  public active: boolean;
  public guest: boolean;
}
