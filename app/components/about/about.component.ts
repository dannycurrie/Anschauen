import { Component } from '@angular/core';
import { AudioService } from '../../Services/AudioService';

@Component({
    selector: 'my-about',
    templateUrl: 'components/about/about.component.html',
    styleUrls: ['components/about/about.component.css']
})
export class AboutComponent {

light:boolean = true;
dark: boolean = false;

    constructor(private audioService:AudioService) {
        this.audioService.endOfBarSubject.subscribe(
            message => {
                    console.log('end of bar message in aboutcomponent: ' + JSON.stringify(message));
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
}