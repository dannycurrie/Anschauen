import { Component, Input, ElementRef } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import { AudioService } from '../../Services/AudioService';
import { IAudioObject } from '../../Shared/Interfaces';
import * as D3 from 'd3';

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
        // start playing at no volume, to ensure timing is accurate between audio pieces
        this.initAudio();
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

    initAudio(){
        this.audioObject.init();
    }


    playAudio(){
        if(this.audioObject && !this.playing){
            this.audioObject.play();
            this.audioObject.audioBufferSource.connect(this.audioService.analyser);
            this.playing = true;
        }
    }

    stopAudio(){
        if(this.audioObject && this.playing){
            this.audioObject.stop();
            this.playing = false;
            this.audioObject.audioBufferSource.disconnect(this.audioService.analyser);
        }
    }
}