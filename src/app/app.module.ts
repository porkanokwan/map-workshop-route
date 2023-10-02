import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { RouteToolComponent } from './route-tool/route-tool.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    RouteToolComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
