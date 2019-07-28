import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditListDrinkComponent} from './edit-list-drink.component';

describe('EditListDrinkComponent', () => {
  let component: EditListDrinkComponent;
  let fixture: ComponentFixture<EditListDrinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [EditListDrinkComponent]})
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditListDrinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
