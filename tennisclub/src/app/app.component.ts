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

  constructor() {
  }

  openMemberListing(): void {
    this.memberListingTemplate = true;
  }
}
