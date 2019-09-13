import {Component, OnInit} from '@angular/core';
import {Drink} from 'src/app/models/drink/drink.model';
import {DrinklistSetting} from 'src/app/models/drink/drinklistSetting.model';
import {Member} from 'src/app/models/member/member.model';

import {FileService} from '../../../file.service';


@Component({
  selector: 'app-edit-list-drink',
  templateUrl: './edit-list-drink.component.html',
  styleUrls: ['./edit-list-drink.component.css']
})
export class EditListDrinkComponent implements OnInit {
  public currentSettings: DrinklistSetting;
  public selectedPersonId: number;
  public avaiableUsers: Member[];
  public avaiableUsersList: String[] = [];

  public creator: Member;
  public startDate: Date;
  public endDate: Date;
  public drinks: Drink[];
  public members: Member[];
  public guests: Member[];

  selectedSimpleItem = 'Two';
  simpleItems = [];

  selectedCars = [3];
  cars = [
      { id: 1, name: 'Volvo' },
      { id: 2, name: 'Saab', disabled: true },
      { id: 3, name: 'Opel' },
      { id: 4, name: 'Audi' },
  ];

  constructor(
      private fileService: FileService) {
      }

  ngOnInit(): void {

    this.simpleItems = [true, 'Two', 3];
    this.fileService.getFile('/mitglieder.json')
        .then((memberList) => {
          this.members = JSON.parse(memberList);
          return this.fileService.getFile('/gaeste.json');
        })
        .then((guestList) => {
          this.guests = JSON.parse(guestList);
          return this.fileService.getFile('/getraenke.json');
        }).then((drinks) => {
          this.drinks = JSON.parse(drinks);
        })
        .catch((err) => {
          console.log(err);
        });
  }

  save(): void {}

  delete(): void {
  }

  addDrink(): void {}

  addPerson(): void {}

  addCreator(): void {}

  addStartDate(): void {}

  addEndDate(): void {}
}
