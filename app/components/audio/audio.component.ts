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
        this.getAudio("synth");
    }

    getAudio(id: string){
        this.audioService.getAudioObject(id)
        .subscribe((result: IAudioObject) => {
            console.log(JSON.stringify(result));
            this.audioObject = result;
        });
    }

    playAudio(){
        if(this.audioObject)
            this.audioObject.play();
    }

    stopAudio(){
        if(this.audioObject){
            this.audioObject.stop();
        }
    }
}