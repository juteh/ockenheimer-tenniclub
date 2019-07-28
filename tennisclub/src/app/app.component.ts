import {Component} from '@angular/core';
import {FileService} from './file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ockenheimer-tennisclub';

  public memberListingTemplate = false;
  public drinkListingTemplate = false;
  public drinkEditor = false;
  public drinkListsEditor = false;

  constructor() {}

  openTemplate(name: String): void {
    this.memberListingTemplate = false;
    this.drinkListingTemplate = false;
    this.drinkEditor = false;
    this.drinkListsEditor = false;
    switch (name) {
      case 'MEMBER': {
        this.memberListingTemplate = true;
        break;
      }
      case 'DRINKSLISTS': {
        this.drinkListingTemplate = true;
        break;
      }
      case 'DRINKS': {
        this.drinkEditor = true;
        break;
      }
      case 'CEATEDRINKSLIST': {
        this.drinkListsEditor = true;
        break;
      }
      default: { break; }
    }
  }
}
