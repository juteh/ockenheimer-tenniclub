import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {DrinklistSetting} from 'src/app/models/drink/drinklistSetting.model';
import {Member} from 'src/app/models/member/member.model';

import {FileService} from './../../../file.service';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.css']
})
export class EditTemplateComponent implements OnInit {
  public drinklistSettingsForm: FormGroup;
  public currentSettings: DrinklistSetting;
  public selectedPersonId: number;
  public avaiableUsers: Member[];
  constructor(
      public activeModal: NgbActiveModal, private formBuilder: FormBuilder,
      private fileService: FileService) {
    this.drinklistSettingsForm =
        this.formBuilder.group({users: [], drinks: []});
  }

  ngOnInit(): void {
    this.fileService.getFile('/mitglieder.json')
        .then((avaiableUsers) => {
          console.log(avaiableUsers);
          this.avaiableUsers = JSON.parse(avaiableUsers);
          console.log(this.avaiableUsers);
          return this.fileService.getFile('/getraenkeliste-settings.json')
              .then((settings) => {
                this.currentSettings = JSON.parse(settings);
                this.drinklistSettingsForm.patchValue({
                  users: this.currentSettings.users,
                  drinks: this.currentSettings.drinks,
                });
              })
              .catch((err) => {
                console.log(err);
              });
        })
        .catch((err) => {
          console.log(err);
        });
  }

  save(): void {
    this.currentSettings = this.drinklistSettingsForm.value;
    this.activeModal.close(this.currentSettings);
  }
}
