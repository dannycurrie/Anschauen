import { ModuleWithProviders } from '@angular/core';

export interface IAudioObject {
    id: string;
    filepath: string;
    context: AudioContext;
    gain: GainNode;
    audioBuffer: AudioBuffer;
    audioBufferSource: AudioBufferSourceNode;
    play: Function;
    stop: Function;
    init: Function;
    isInit: boolean;
}