import { ModuleWithProviders } from '@angular/core';

export interface IAudioObject {
    id: string;
    filepath: string;
    context: AudioContext;
    audio: AudioBuffer;
    play: Function;
    init: boolean;
}