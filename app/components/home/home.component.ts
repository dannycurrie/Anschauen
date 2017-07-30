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

dark = false;
light = true;

    // counting the loaded audio pieces so we can sync their inits
    _audioInitCount:number = 0;
    _totalAudioComponents:number = 8;

    constructor(private audioService: AudioService) {

        this.audioService.audioLoadSubject.subscribe(
            message => {
                console.log('audio load message: ' + JSON.stringify(message));

                if(message.message == 'audioLoaded'){

                    this._audioInitCount++;
                    console.log(message.value + ' loaded. ' + this._audioInitCount + ' of 8');

                    // if we have all of the components, proceed with initiation
                    if(this._audioInitCount == this._totalAudioComponents){
                        this.audioService.initAudioObjects(true);
                    }
                }
            }
        );

        this.audioService.endOfBarSubject.subscribe(
            message => {
                    console.log('end of bar: ' + JSON.stringify(message));
                    if(message.message == 'endOfBar'){
                        if(this.dark){
                            this.dark = false;
                            this.light = true;
                        }else{
                            this.dark = true;
                            this.light = false;
                        }
                }
            }
        );
    }

    syncAudioPieces(){
        console.log('syncing audio');
        this.audioService.initAudioObjects(false);
    }
}