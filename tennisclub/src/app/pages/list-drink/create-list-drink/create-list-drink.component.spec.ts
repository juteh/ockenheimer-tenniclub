import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateListDrinkComponent } from './create-list-drink.component';

describe('CreateListDrinkComponent', () => {
  let component: CreateListDrinkComponent;
  let fixture: ComponentFixture<CreateListDrinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateListDrinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateListDrinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
