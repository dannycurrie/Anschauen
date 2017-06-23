import { Component } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import { AudioService } from '../../Services/AudioService';
import { IAudioObject } from '../../Shared/Interfaces';

@Component({
    selector: 'my-home',
    templateUrl: 'components/home/home.component.html',
    styleUrls: ['components/home/home.component.css']
})
export class HomeComponent {
    name: string = "Home page";
    users: {};
    audioObject: IAudioObject;

    audioPieces: IAudioObject[];

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