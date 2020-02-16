import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDrinkCalculaterComponent } from './list-drink-calculater.component';

describe('ListDrinkCalculaterComponent', () => {
  let component: ListDrinkCalculaterComponent;
  let fixture: ComponentFixture<ListDrinkCalculaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDrinkCalculaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDrinkCalculaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
