import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { IAudioObject } from '../Shared/Interfaces';

@Injectable()
export class AudioService {

    context: AudioContext;
    analyser: AnalyserNode;

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
        var gainNode: GainNode = ac.createGain();
        var analyser: AnalyserNode = this.getAnalyser();

        audioObject = {
            id: id,
            filepath: f,
            context: ac,
            analyser: analyser,
            audioBuffer: buffer,
            audioBufferSource: bufferSourceNode,
            gain: gainNode,
            play: ()=>{
                    audioObject.gain.gain.value = 1;
            },
            stop: () =>{
                audioObject.gain.gain.value = 0;
            },
            init: ()=> {
                    var getSound = new XMLHttpRequest();
                    getSound.open("GET", f, true);
                    getSound.responseType = "arraybuffer";
                    getSound.onload = function(){
                        console.log('decoding');
                        // decode audio data
                        ac.decodeAudioData(getSound.response, function(result){
                            audioObject.audioBuffer = result;
                            audioObject.audioBufferSource = audioObject.context.createBufferSource();
                            audioObject.audioBufferSource.buffer = audioObject.audioBuffer;
                            
                            // connect other nodes
                            audioObject.audioBufferSource.connect(audioObject.gain);
                            audioObject.gain.connect(audioObject.context.destination);
                            // fist time, we'll play silently
                            audioObject.gain.gain.value = 0;

                            audioObject.audioBufferSource.start(audioObject.context.currentTime);
                            audioObject.audioBufferSource.loop = true;

                            audioObject.isInit = true;
                        });
                    }
                    getSound.send();
                
            },
            isInit: false
        };

        return audioObject;
    }

    getFilePath(id: string){
        return "AudioFiles/" + id + ".wav";
    }

    getAudioContext(){
        if(!this.context)
            this.context = new AudioContext();

        return this.context;
    }

    getAnalyser(){
        if(!this.analyser)
            this.analyser = this.getAudioContext().createAnalyser();
            
        return this.analyser;
    }

    getAudio(c: AudioContext) : AudioBufferSourceNode {
        return c.createBufferSource();
    }
}