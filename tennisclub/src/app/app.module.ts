
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {PapaParseModule} from 'ngx-papaparse';

import {AppComponent} from './app.component';
import {NotificationComponent} from './components/notification/notification.component';
import {DrinkEditorComponent} from './pages/drink/drink-editor/drink-editor.component';
import {EditDrinkComponent} from './pages/drink/drink-editor/edit-drink/edit-drink.component';
import {CreateListDrinkTemplateComponent} from './pages/list-drink/create-list-drink-template/create-list-drink-template.component';
import {CreateListDrinkComponent} from './pages/list-drink/create-list-drink/create-list-drink.component';
import {ListDrinkCalculaterComponent} from './pages/list-drink/list-drink-calculater/list-drink-calculater.component';
import {ListDrinksComponent} from './pages/list-drink/list-drinks/list-drinks.component';
import {EditUserComponent} from './pages/user/list-users/edit-user/edit-user.component';
import {ListUsersComponent} from './pages/user/list-users/list-users.component';
import {FilterPipe} from './pipes/filter.pipe';
import {NumberPickerModule} from 'ng-number-picker';
import { InstructionComponent } from './pages/instruction/instruction.component';
import { ExportModalComponent } from './pages/list-drink/list-drinks/export-modal/export-modal.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

const routes: Routes = [{path: 'user', component: ListUsersComponent}];

@NgModule({
  declarations: [
    AppComponent, ListUsersComponent, EditUserComponent, ListDrinksComponent,
    CreateListDrinkTemplateComponent, DrinkEditorComponent, EditDrinkComponent,
    NotificationComponent, FilterPipe, CreateListDrinkComponent,
    ListDrinkCalculaterComponent,
    InstructionComponent,
    ExportModalComponent
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(routes), PapaParseModule, NgbModule,
    ReactiveFormsModule, FormsModule, NgSelectModule, NumberPickerModule,
    BrowserAnimationsModule, ToastrModule.forRoot(), CommonModule
  ],
  providers: [
    CreateListDrinkTemplateComponent, CreateListDrinkComponent,
    ListDrinkCalculaterComponent
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    EditUserComponent, ListDrinksComponent, EditDrinkComponent,
    NotificationComponent, CreateListDrinkTemplateComponent,
    CreateListDrinkComponent, CreateListDrinkTemplateComponent,
    ListDrinkCalculaterComponent, ExportModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
