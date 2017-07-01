import { Component } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import { AudioService } from '../../Services/AudioService';
import { IAudioObject } from '../../Shared/Interfaces';

@Component({
    selector: 'my-audio',
    templateUrl: 'components/audio/audio.component.html',
    styleUrls: ['components/audio/audio.component.css']
})
export class AudioComponent {
    audioObject: IAudioObject;

    constructor(private audioService: AudioService) {
    }

    getServiceData(id: string){
        this.audioService.getAudioObject(id)
        .subscribe((result: IAudioObject) => {
            console.log(JSON.stringify(result));
            this.audioObject = result;
            this.audioObject.play();
        });
    }

    stopPlaying(){
        if(this.audioObject){
            this.audioObject.stop();
        }
    }

    playData(){
        this.audioObject.play();
    }
}