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

    constructor(private audioService: AudioService) {
        this.getServiceData();
    }

    getServiceData(){
        this.audioService.getAudioObject('hello')
        .subscribe((result: IAudioObject) => {
            console.log(JSON.stringify(result));
            this.audioObject = result;
        });
    }

    playData(){
        this.audioObject.play();
    }
}