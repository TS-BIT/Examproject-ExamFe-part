import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './components/app/app.component';
import { ArrivalsComponent } from './components/arrivals/arrivals.component';
import { HeaderComponent } from './components/header/header.component';
import { ArrivalComponent } from './components/arrival/arrival.component';
import { TimePipe } from './pipes/time.pipe';
import { DeparturesComponent } from './components/departures/departures.component';

@NgModule({
  declarations: [
    AppComponent,
    ArrivalsComponent,
    HeaderComponent,
    ArrivalComponent,
    TimePipe,
    DeparturesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'arrivals', component: ArrivalsComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
