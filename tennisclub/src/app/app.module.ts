
import { CreateListDrinkTemplateComponent } from './pages/list-drink/create-list-drink-template/create-list-drink-template.component';
import { FilterPipe } from './pipes/filter.pipe';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PapaParseModule} from 'ngx-papaparse';

import {AppComponent} from './app.component';
import {NotificationComponent} from './components/notification/notification.component';
import {DrinkEditorComponent} from './pages/drink/drink-editor/drink-editor.component';
import {EditDrinkComponent} from './pages/drink/drink-editor/edit-drink/edit-drink.component';
import {EditUserComponent} from './pages/user/list-users/edit-user/edit-user.component';
import {ListUsersComponent} from './pages/user/list-users/list-users.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CreateListDrinkComponent } from './pages/list-drink/create-list-drink/create-list-drink.component';
import { ListDrinksComponent } from './pages/list-drink/list-drinks/list-drinks.component';

const routes: Routes = [{path: 'user', component: ListUsersComponent}];

@NgModule({
  declarations: [
    AppComponent, ListUsersComponent, EditUserComponent, ListDrinksComponent,
    CreateListDrinkTemplateComponent, DrinkEditorComponent, EditDrinkComponent,
    NotificationComponent, FilterPipe, CreateListDrinkComponent
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(routes), PapaParseModule, NgbModule,
    ReactiveFormsModule, FormsModule, NgSelectModule
  ],
  providers: [CreateListDrinkTemplateComponent, CreateListDrinkComponent],
  bootstrap: [AppComponent],
  entryComponents: [
    EditUserComponent, ListDrinksComponent, EditDrinkComponent,
    NotificationComponent, CreateListDrinkTemplateComponent, CreateListDrinkComponent, CreateListDrinkTemplateComponent
  ], schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
