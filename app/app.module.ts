import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { AboutComponent } from "./components/about/about.component";
import { routing } from "./routes";
import { HomeComponent } from "./components/home/home.component";
import { TestComponent } from "./components/test/test.component";
import { AudioService } from './Services/AudioService';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        JsonpModule,
        routing
    ],
    declarations: [
        AppComponent,
        AboutComponent,
        HomeComponent,
        TestComponent
    ],
    providers: [ AudioService ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
