import { DrinklistSetting } from './../../../models/drink/drinklistSetting.model';
import { EditTemplateComponent } from './../edit-template/edit-template.component';
import {Component, OnInit} from '@angular/core';

import {FileService} from './../../../file.service';
import {Drinklist} from './../../../models/drink/drinklist.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-drinks',
  templateUrl: './list-drinks.component.html',
  styleUrls: ['./list-drinks.component.css']
})
export class ListDrinksComponent implements OnInit {
  public drinklistings: Drinklist[];

  constructor(private fileService: FileService, private modalService: NgbModal) {
    this.fileService.getFile('/getraenkeliste.json')
        .then((drinklistings) => {
          console.log('drinklistings: ', drinklistings);
          this.drinklistings = JSON.parse(drinklistings);
        })
        .catch((err) => {
          console.log(err);
        });
  }

  ngOnInit(): void {}

  openCreateTemplateDrinklist(): void {
    const modalRef = this.modalService.open(EditTemplateComponent, {size: 'lg'});

    modalRef.result.then(
        (drinklistSetting: DrinklistSetting) => {
          this.fileService.updateFile('/getraenkeliste-settings.json', JSON.stringify(drinklistSetting));
        },
        (err) => {
          console.log(err);
        });
  }
}
