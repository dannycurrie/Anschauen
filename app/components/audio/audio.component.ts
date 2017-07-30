import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
    playbackSpeed:number = 1;
    light = true;
    dark = false;

    @Input() set audioId(audioId: string){
        this._audioId = audioId;
        this.getAudio(this._audioId);
    }

    constructor(private audioService: AudioService) {
        this.audioService.endOfBarSubject.subscribe(
            message => {
                    console.log('end of bar message in audiocomponent: ' + JSON.stringify(message));
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

    ngOninit(){

    }

    getAudio(id: string){
        this.audioService.getAudioObject(id)
        .subscribe((result: IAudioObject) => {
            this.audioObject = result;
            // TODO: should the component do this?
            this.audioObject.loadAudio();
        });
    }

    initAudio(){
        this.audioObject.init();
    }

    changeSpeed(){
        if(this.playbackSpeed == 1)
            this.audioObject.audioBufferSource.playbackRate.value = this.playbackSpeed = 0.5;
        else
            this.audioObject.audioBufferSource.playbackRate.value = this.playbackSpeed = 1;
    }

    playAudio(){
        this.audioObject.play();
        this.audioObject.audioBufferSource.connect(this.audioService.analyser);
        this.playing = true;
    }

    stopAudio(){
        this.audioObject.stop();
        this.playing = false;
        this.audioObject.audioBufferSource.disconnect(this.audioService.analyser);
    }

    volumeUp(){
        this.audioObject.gain.gain.value += 0.2;
    }

    volumeDown(){
        this.audioObject.gain.gain.value -= 0.2;
    }
}