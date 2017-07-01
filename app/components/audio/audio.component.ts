import { Component, Input } from '@angular/core';
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

    _audioId: string;
    audioObject: IAudioObject;
    playing: boolean = false;

    @Input() set audioId(audioId: string){
        this._audioId = audioId;
        this.getAudio(this._audioId);
    }

    constructor(private audioService: AudioService) {
    }

    getAudio(id: string){
        this.audioService.getAudioObject(id)
        .subscribe((result: IAudioObject) => {
            console.log(JSON.stringify(result));
            this.audioObject = result;
        });
    }

    playAudio(){
        if(this.audioObject && !this.playing){
            this.audioObject.play();
            this.playing = true;
        }
    }

    stopAudio(){
        if(this.audioObject && this.playing){
            this.audioObject.stop();
            this.playing = false;
        }
    }
}