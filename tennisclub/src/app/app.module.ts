import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PapaParseModule } from 'ngx-papaparse';
import { EditUserComponent } from './pages/user/list-users/edit-user/edit-user.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ListUsersComponent } from './pages/user/list-users/list-users.component';

import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'user', component: ListUsersComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ListUsersComponent,
    EditUserComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    PapaParseModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [EditUserComponent]
})
export class AppModule { }
