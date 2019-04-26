import {Component} from '@angular/core';
import {FileService} from './file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ockenheimer-tennisclub';

  constructor(private fileService: FileService) {
    fileService.getFile('/test.txt')
        .then((result) => {
          console.log('result: ', result);
          fileService.updateFile('/test.txt', 'test the shit').then((res) => {
            console.log(result);
          }).catch((err) => {
            console.log(err);
          });
        })
        .catch((err) => {
          console.log('error: ', err);
        });
  }
}
