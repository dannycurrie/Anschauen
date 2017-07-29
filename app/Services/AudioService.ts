import { Injectable, Output, EventEmitter, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { IAudioObject } from '../Shared/Interfaces';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AudioService {

    context: AudioContext;
    analyser: AnalyserNode;
    audioObjects: Array<IAudioObject> = new Array<IAudioObject>();
    notifyLoad:Observable<string>;
    private subject = new Subject<any>();

    constructor(private http: Http){

    }

    getAudioObject(id: string) : Observable<IAudioObject>{
        var audioObject: IAudioObject = this.initAudioObject(id);
        this.audioObjects.push(audioObject);
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
            subject: this.subject,
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
            loadAudio: (notifyLoad:Function) => {
                console.log('loading ' + audioObject.id);
                    var getSound = new XMLHttpRequest();
                    getSound.open("GET", f, true);
                    getSound.responseType = "arraybuffer";
                    getSound.onload = function(){
                        console.log('decoding ' + audioObject.id);
                        // decode audio data
                        ac.decodeAudioData(getSound.response, function(result){
                            audioObject.audioBuffer = result;
                            audioObject.audioBufferSource = audioObject.context.createBufferSource();
                            audioObject.audioBufferSource.buffer = audioObject.audioBuffer;
                            
                            // connect other nodes
                            audioObject.audioBufferSource.connect(audioObject.gain);
                            audioObject.gain.connect(audioObject.context.destination);
                            audioObject.subject.next({ id: id });
                        });
                    }
                    getSound.send();
            },
            init: (currentTime:number)=>{
                // fist time, we'll play silently
                audioObject.gain.gain.value = 0;
                audioObject.isInit = true;
                audioObject.audioBufferSource.start(currentTime);
                audioObject.audioBufferSource.loop = true;
                console.log(audioObject.id + ' init ' + new Date().getMilliseconds());
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

    initAudioObjects(){
        // grab current time to sync sounds 
        var currentTime = this.context.currentTime;
        this.audioObjects.forEach((ob) => { ob.init(currentTime); })
    }

    getAudioLoadNotification(): Observable<any> {
        return this.subject.asObservable();
    }
}