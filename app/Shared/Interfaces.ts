import { ModuleWithProviders, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface IAudioObject {
    id: string;
    filepath: string;
    context: AudioContext;
    analyser: AnalyserNode;
    gain: GainNode;
    audioBuffer: AudioBuffer;
    audioBufferSource: AudioBufferSourceNode;
    play: Function;
    stop: Function;
    loadAudio: Function;
    init: Function;
    isInit: boolean;
    subject:Subject<any>;
}