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
        var bufferSourceNode: AudioBufferSourceNode;

        audioObject = {
            id: id,
            filepath: f,
            context: ac,
            audioBuffer: buffer,
            audioBufferSource: bufferSourceNode,
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
                            audioObject.audioBuffer = result;
                            audioObject.audioBufferSource = audioObject.context.createBufferSource();
                            audioObject.audioBufferSource.buffer = audioObject.audioBuffer;
                            audioObject.audioBufferSource.connect(audioObject.context.destination);
                            audioObject.audioBufferSource.start(audioObject.context.currentTime);
                            audioObject.audioBufferSource.loop = true;
                        });
                    }
                    getSound.send();
                }else{
                    audioObject.audioBufferSource = audioObject.context.createBufferSource();
                    audioObject.audioBufferSource.buffer = audioObject.audioBuffer;
                    audioObject.audioBufferSource.connect(audioObject.context.destination);
                    audioObject.audioBufferSource.start(audioObject.context.currentTime);
                    audioObject.audioBufferSource.loop = true;
                }
            },
            stop: () =>{
                if(audioObject.init)
                    audioObject.audioBufferSource.stop(audioObject.context.currentTime);
            },
            init: false
        };

        return audioObject;
    }

    getFilePath(id: string){
        return "AudioFiles/" + id + ".wav";
    }

    getAudioContext(){
        return new AudioContext();
    }

    getAudio(c: AudioContext) : AudioBufferSourceNode {
        return c.createBufferSource();
    }
}