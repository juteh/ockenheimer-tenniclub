import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
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
  public invalid = false;
  public price = '0';
  private currentPrice = 0;
  public liter = '0';
  private currentLiter = 0;
  public submit = false;

  constructor(
      public activeModal: NgbActiveModal, private formBuilder: FormBuilder) {
    this.drinkForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: '',
    });
  }

  ngOnInit(): void {
    if (!this.createMode && this.drink) {
      this.drinkForm.patchValue({
        name: this.drink.name,
        description: this.drink.description,
      });
      this.price = this.drink.price.toFixed(2);
      this.currentPrice = this.drink.price;
      this.liter = this.drink.liter.toFixed(3);
      this.currentLiter = this.drink.liter;
    }
  }

  save(): void {
    this.submit = true;
    if (this.drinkForm.valid) {
      this.drink = new Drink();
      this.drink.name = this.drinkForm.value.name;
      this.drink.description = this.drinkForm.value.description;
      this.drink.liter = this.currentLiter;
      this.drink.price = this.currentPrice;
      this.activeModal.close(this.drink);
    }
  }

  // ng-number-picker hat einen bug beim addieren und muss händisch gelöst
  // werden
  public changeLiter(event): void {
    if (isNaN(event)) {
      this.currentLiter += 0.1;
      this.liter = this.currentLiter.toFixed(3);
    } else {
      this.currentLiter = +this.liter;
      this.liter = this.currentLiter.toFixed(3);
    }
  }

  // ng-number-picker hat einen bug beim addieren und muss händisch gelöst
  // werden
  public changePrice(event): void {
    if (isNaN(event)) {
      this.currentPrice += +0.1;
      this.price = this.currentPrice.toFixed(2);
    } else {
      this.currentPrice = +this.price;
      this.price = this.currentPrice.toFixed(2);
    }
  }
}
