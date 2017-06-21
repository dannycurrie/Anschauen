import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { IAudioObject } from '../Shared/Interfaces';

@Injectable()
export class AudioService {

    constructor(private http: Http){

    }

    getAudioObject(id: string) : Observable<IAudioObject>{
        // TODO create and return audio object

        var audioObject: IAudioObject = this.initAudioObject(id);

        return new Observable<IAudioObject>((subscriber: Subscriber<IAudioObject>) => subscriber.next(audioObject));
    }

    initAudioObject(id: string): IAudioObject {

        var ac = this.getAudioContext();
        var f = this.getFilePath(id);
        var buffer;
        var audioObject: IAudioObject;

        audioObject = {
            id: id,
            filepath: f,
            context: ac,
            audio: buffer,
            play: ()=>{

                if(!audioObject.init){
                    var getSound = new XMLHttpRequest();
                    getSound.open("GET", f, true);
                    getSound.responseType = "arraybuffer";
                    getSound.onload = function(){
                        console.log('decoding');
                        // decode audio data
                        ac.decodeAudioData(getSound.response, function(result){
                            audioObject.init = true;
                            audioObject.audio = result;
                            var playSound = audioObject.context.createBufferSource();
                            playSound.buffer = audioObject.audio;
                            playSound.connect(audioObject.context.destination);
                            playSound.start(audioObject.context.currentTime);
                            playSound.loop = true;
                        });
                    }
                    getSound.send();
                }else{
                    var playSound = audioObject.context.createBufferSource();
                    playSound.buffer = audioObject.audio;
                    playSound.connect(audioObject.context.destination);
                    playSound.start(audioObject.context.currentTime);
                    playSound.loop = true;
                }
            },
            init: false
        };

        return audioObject;
    }

    getFilePath(id: string){
        return "AudioFiles/Synth.wav";
    }

    getAudioContext(){
        return new AudioContext();
    }

    getAudio(c: AudioContext) : AudioBufferSourceNode {
        return c.createBufferSource();
    }
}