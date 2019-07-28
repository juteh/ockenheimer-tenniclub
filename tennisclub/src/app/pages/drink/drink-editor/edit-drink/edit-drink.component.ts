import {THIS_EXPR} from '@angular/compiler/src/output/output_ast';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {Drink} from './../../../../models/drink/drink.model';

@Component({
  selector: 'app-edit-drink',
  templateUrl: './edit-drink.component.html',
  styleUrls: ['./edit-drink.component.css']
})
export class EditDrinkComponent implements OnInit {
  @Input() createMode: boolean;
  @Input() drink: Drink;

  public drinkForm: FormGroup;
  public submit = false;

  constructor(
      public activeModal: NgbActiveModal, private formBuilder: FormBuilder) {
    this.drinkForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: '',
      litres: '',
      price: '',
    });
  }

  ngOnInit(): void {
    console.log(this.drink);
    console.log(this.createMode);
    if (!this.createMode && this.drink) {
      this.drinkForm.patchValue({
        name: this.drink.name,
        description: this.drink.description,
        litres: this.drink.litres,
        price: this.drink.price,
      });
    }
  }

  save(): void {
    this.submit = true;
    if (this.drinkForm.valid) {
      this.drink = new Drink();
      this.drink.name = this.drinkForm.value.name;
      this.drink.description = this.drinkForm.value.description;
      this.drink.litres = this.drinkForm.value.litres;
      this.drink.price = this.drinkForm.value.price;

      this.activeModal.close(this.drink);
    }
  }
}
