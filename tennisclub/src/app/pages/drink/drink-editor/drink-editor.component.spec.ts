import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkEditorComponent } from './drink-editor.component';

describe('DrinkEditorComponent', () => {
  let component: DrinkEditorComponent;
  let fixture: ComponentFixture<DrinkEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrinkEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrinkEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
