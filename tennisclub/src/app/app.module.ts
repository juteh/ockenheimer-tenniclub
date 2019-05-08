import { ListDrinksComponent } from './pages/drink/list-drinks/list-drinks.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PapaParseModule } from 'ngx-papaparse';
import { EditUserComponent } from './pages/user/list-users/edit-user/edit-user.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ListUsersComponent } from './pages/user/list-users/list-users.component';

import { ReactiveFormsModule } from '@angular/forms';
import { RemoveUserComponent } from './pages/user/list-users/remove-user/remove-user.component';
import { EditTemplateComponent } from './pages/drink/edit-template/edit-template.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'user', component: ListUsersComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ListUsersComponent,
    EditUserComponent,
    RemoveUserComponent,
    ListDrinksComponent,
    EditTemplateComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    PapaParseModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [EditUserComponent, RemoveUserComponent, ListDrinksComponent, EditTemplateComponent]
})
export class AppModule { }
