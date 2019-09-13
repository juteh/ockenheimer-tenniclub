import { EditListDrinkComponent } from './../edit-list-drink/edit-list-drink.component';
import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {FileService} from './../../../file.service';
import {Drinklist} from './../../../models/drink/drinklist.model';
import {DrinklistSetting} from './../../../models/drink/drinklistSetting.model';

@Component({
  selector: 'app-list-drinks',
  templateUrl: './list-drinks.component.html',
  styleUrls: ['./list-drinks.component.css']
})
export class ListDrinksComponent implements OnInit {
  public drinklistings: Drinklist[];

  constructor(
      private fileService: FileService, private modalService: NgbModal) {
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
    const modalRef =
        this.modalService.open(EditListDrinkComponent, {size: 'lg'});

    modalRef.result.then(
        (drinklistSetting: DrinklistSetting) => {
          this.fileService.updateFile(
              '/getraenkeliste-settings.json',
              JSON.stringify(drinklistSetting));
        },
        (err) => {
          console.log(err);
        });
  }

  openEditDrinkList(drinkList: Drinklist, index: number): void {
    //  TODO: Die getränke und Personen werden je nach Wunsch der Benutzers
    //  hinzugefügt. Beim öffnen einer Neuen Liste, werden die gleichen Getränke
    //  und Personen genommen, wie bei der letztem template. Das heißt sie
    //  werden als vordefinierte Einstellung benutzt für jede weitere neue
    //  Getränkeliste
    // Das editieren wäre kein Model sondern eine normal Seite, wo an den seiten
    // Getränke und Personen dynamisch hinzugefügt werden.
  }

  deleteDrinkList(index: number) {}
}
