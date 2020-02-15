import { CreateListDrinkTemplateComponent } from './create-list-drink-template.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

describe('CreateListDrinkTemplateComponent', () => {
  let component: CreateListDrinkTemplateComponent;
  let fixture: ComponentFixture<CreateListDrinkTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [CreateListDrinkTemplateComponent]})
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateListDrinkTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
