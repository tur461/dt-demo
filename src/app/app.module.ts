import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {TableModule} from 'primeng/table';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AirlineService } from './dtable/services/airline.service';
import { DtableComponent } from './dtable/dtable.component';
import { ColHeadComponent } from './col-head/col-head.component';
import { ColSearchComponent } from './col-search/col-search.component';
import { ColDivComponent } from './col-div/col-div.component';
import { SuperUserComponent } from './super-user/super-user.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { TableTopbarComponent } from './table-topbar/table-topbar.component';

@NgModule({
  declarations: [
    AppComponent,
    DtableComponent,
    ColHeadComponent,
    ColSearchComponent,
    ColDivComponent,
    SuperUserComponent,
    PaginatorComponent,
    TableTopbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TableModule
  ],
  providers: [AirlineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
