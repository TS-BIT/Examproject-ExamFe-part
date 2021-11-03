import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './components/app/app.component';
import { ArrivalsComponent } from './components/arrivals/arrivals.component';
import { HeaderComponent } from './components/header/header.component';
import { TimePipe } from './pipes/time.pipe';
import { DeparturesComponent } from './components/departures/departures.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    ArrivalsComponent,
    HeaderComponent,
    TimePipe,
    DeparturesComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'arrivals', component: ArrivalsComponent },
      { path: 'departures', component: DeparturesComponent },
      { path: '', component: HomeComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
