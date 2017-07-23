"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
var AudioService = (function () {
    function AudioService(http) {
        this.http = http;
    }
    AudioService.prototype.getAudioObject = function (id) {
        // TODO create and return audio object
        var audioObject = this.initAudioObject(id);
        return new Observable_1.Observable(function (subscriber) { return subscriber.next(audioObject); });
    };
    AudioService.prototype.initAudioObject = function (id) {
        var ac = this.getAudioContext();
        var f = this.getFilePath(id);
        var buffer;
        var audioObject;
        var bufferSourceNode;
        var gainNode = ac.createGain();
        var analyser = ac.createAnalyser();
        audioObject = {
            id: id,
            filepath: f,
            context: ac,
            analyser: analyser,
            audioBuffer: buffer,
            audioBufferSource: bufferSourceNode,
            gain: gainNode,
            play: function () {
                audioObject.gain.gain.value = 1;
            },
            stop: function () {
                audioObject.gain.gain.value = 0;
            },
            init: function () {
                var getSound = new XMLHttpRequest();
                getSound.open("GET", f, true);
                getSound.responseType = "arraybuffer";
                getSound.onload = function () {
                    console.log('decoding');
                    // decode audio data
                    ac.decodeAudioData(getSound.response, function (result) {
                        audioObject.audioBuffer = result;
                        audioObject.audioBufferSource = audioObject.context.createBufferSource();
                        audioObject.audioBufferSource.buffer = audioObject.audioBuffer;
                        // connect other nodes
                        audioObject.audioBufferSource.connect(audioObject.gain);
                        audioObject.gain.connect(audioObject.context.destination);
                        audioObject.audioBufferSource.connect(audioObject.analyser);
                        // fist time, we'll play silently
                        audioObject.gain.gain.value = 0;
                        audioObject.audioBufferSource.start(audioObject.context.currentTime);
                        audioObject.audioBufferSource.loop = true;
                        audioObject.isInit = true;
                    });
                };
                getSound.send();
            },
            isInit: false
        };
        return audioObject;
    };
    AudioService.prototype.getFilePath = function (id) {
        return "AudioFiles/" + id + ".wav";
    };
    AudioService.prototype.getAudioContext = function () {
        if (!this.context)
            this.context = new AudioContext();
        return this.context;
    };
    AudioService.prototype.getAudio = function (c) {
        return c.createBufferSource();
    };
    return AudioService;
}());
AudioService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], AudioService);
exports.AudioService = AudioService;
//# sourceMappingURL=AudioService.js.map