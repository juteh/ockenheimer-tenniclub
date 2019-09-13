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
import {EditListDrinkComponent} from './pages/drink/edit-list-drink/edit-list-drink.component';
import {ListDrinksComponent} from './pages/drink/list-drinks/list-drinks.component';
import {EditUserComponent} from './pages/user/list-users/edit-user/edit-user.component';
import {ListUsersComponent} from './pages/user/list-users/list-users.component';

const routes: Routes = [{path: 'user', component: ListUsersComponent}];

@NgModule({
  declarations: [
    AppComponent, ListUsersComponent, EditUserComponent, ListDrinksComponent,
    EditListDrinkComponent, DrinkEditorComponent, EditDrinkComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(routes), PapaParseModule, NgbModule,
    ReactiveFormsModule, FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    EditUserComponent, ListDrinksComponent, EditDrinkComponent,
    NotificationComponent
  ], schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
