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
    audioLoadSubject:Subject<any> = new Subject<any>();;
    endOfBarSubject:Subject<any> = new Subject<any>();;
    barLength: number = 10000;
    barCount: number = 1;

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
            subject: this.audioLoadSubject,
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
                            audioObject.barLength = audioObject.audioBuffer.duration * 1000;
                            
                            // connect other nodes
                            audioObject.audioBufferSource.connect(audioObject.gain);
                            audioObject.gain.connect(audioObject.context.destination);
                            // fist time, we'll play silently
                            audioObject.gain.gain.value = 0;
                            audioObject.subject.next({ message: 'audioLoaded', value: audioObject.id  });
                        });
                    }
                    getSound.send();
            },
            init: (currentTime:number, gainVal:number)=>{
                // if audio already playing, stop and restart
                if(audioObject.isInit){
                    var playbackRate = audioObject.audioBufferSource.playbackRate.value;
                    audioObject.audioBufferSource.stop();
                    audioObject.audioBufferSource = audioObject.context.createBufferSource();
                    audioObject.audioBufferSource.buffer = audioObject.audioBuffer;
                    audioObject.audioBufferSource.connect(audioObject.gain);
                    audioObject.audioBufferSource.playbackRate.value = playbackRate;
                    // connect to analyser
                    if(audioObject.gain.gain.value != 0)
                        audioObject.audioBufferSource.connect(audioObject.analyser);
                }
                audioObject.isInit = true;
                audioObject.audioBufferSource.start(currentTime);
                audioObject.audioBufferSource.loop = true;
                console.log(audioObject.id + ' init ' + new Date().getMilliseconds());
            },
            isInit: false,
            // init bar length - it will get set when we have audio
            barLength: 100000
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

    initAudioObjects(setBars:boolean){
        if(setBars){
            // get end of bar loop going
            this.barLength = this.audioObjects[0].barLength;
            setInterval(() => { this.triggerEndOfBar()}, this.barLength);
        }
        // grab current time to sync sounds 
        var currentTime = this.context.currentTime;
        this.audioObjects.forEach((ob) => { 
            ob.init(currentTime);
         })
    }

    triggerEndOfBar(){
        this.barCount++;
        this.endOfBarSubject.next({ message: 'endOfBar', value: this.barCount });
    }
}