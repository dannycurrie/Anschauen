import { Component } from '@angular/core';
import { AudioService } from './Services/AudioService';
import { IAudioObject }  from './Shared/Interfaces';

@Component({
    selector: 'my-app',
    styleUrls: [],
    templateUrl : 'app.component.html'
})
export class AppComponent {

    constructor(private audioService: AudioService) {

    }
}
