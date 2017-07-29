import { Component, EventEmitter, Output } from '@angular/core';
import { AudioService } from '../../Services/AudioService';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';


@Component({
    selector: 'my-home',
    templateUrl: 'components/home/home.component.html',
    styleUrls: ['components/home/home.component.css']
})
export class HomeComponent {

    // counting the loaded audio pieces so we can sync their inits
    _audioInitCount:number = 0;

    constructor(private audioService: AudioService) {
        this.audioService.getMessage().subscribe(id => { 
            this._audioInitCount++;
            console.log(id.id + ' loaded. ' + this._audioInitCount + ' of 8');

            if(this._audioInitCount == 8){
                this.audioService.initAudioObjects();
            }
        );
    }
}