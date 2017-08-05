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
require("rxjs/add/operator/map");
var AudioService_1 = require("../../Services/AudioService");
var AudioComponent = (function () {
    function AudioComponent(audioService) {
        var _this = this;
        this.audioService = audioService;
        this.playing = false;
        this.playbackSpeed = 1;
        this.light = true;
        this.dark = false;
        this.show = false;
        this.delay = false;
        this.speedChange = new core_1.EventEmitter();
        this.audioService.endOfBarSubject.subscribe(function (message) {
            console.log('end of bar message in audiocomponent: ' + JSON.stringify(message));
            if (message.message == 'endOfBar') {
                if (_this.dark) {
                    _this.dark = false;
                    _this.light = true;
                }
                else {
                    _this.dark = true;
                    _this.light = false;
                }
            }
        });
    }
    Object.defineProperty(AudioComponent.prototype, "audioId", {
        set: function (audioId) {
            this._audioId = audioId;
            this.getAudio(this._audioId);
            // this is an awful hack - TODO rethink when I get time
            // init the default instruments
            if (this._audioId == 'bass' || this._audioId == 'synth' || this._audioId == 'mainpiano' || this._audioId == 'drummedglitch')
                this.playing = true;
        },
        enumerable: true,
        configurable: true
    });
    AudioComponent.prototype.getAudio = function (id) {
        var _this = this;
        this.audioService.getAudioObject(id)
            .subscribe(function (result) {
            _this.audioObject = result;
            // TODO: should the component do this?
            _this.audioObject.loadAudio();
        });
    };
    AudioComponent.prototype.initAudio = function () {
        this.audioObject.init();
    };
    AudioComponent.prototype.changeSpeed = function () {
        if (this.playbackSpeed == 1)
            this.audioObject.audioBufferSource.playbackRate.value = this.playbackSpeed = 0.5;
        else
            this.audioObject.audioBufferSource.playbackRate.value = this.playbackSpeed = 1;
        this.speedChange.emit(this._audioId);
    };
    AudioComponent.prototype.togglePlay = function () {
        if (this.playing)
            this.stopAudio();
        else
            this.playAudio();
    };
    AudioComponent.prototype.playAudio = function () {
        this.audioObject.play();
        this.audioObject.audioBufferSource.connect(this.audioService.analyser);
        this.playing = true;
    };
    AudioComponent.prototype.stopAudio = function () {
        this.audioObject.stop();
        this.playing = false;
        this.audioObject.audioBufferSource.disconnect(this.audioService.analyser);
    };
    AudioComponent.prototype.volumeUp = function () {
        this.audioObject.gain.gain.value += 0.2;
    };
    AudioComponent.prototype.volumeDown = function () {
        this.audioObject.gain.gain.value -= 0.2;
    };
    AudioComponent.prototype.showControls = function () {
        this.show = true;
    };
    AudioComponent.prototype.hideControls = function () {
        this.show = false;
    };
    return AudioComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], AudioComponent.prototype, "audioId", null);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], AudioComponent.prototype, "speedChange", void 0);
AudioComponent = __decorate([
    core_1.Component({
        selector: 'my-audio',
        templateUrl: 'components/audio/audio.component.html',
        styleUrls: ['components/audio/audio.component.css']
    }),
    __metadata("design:paramtypes", [AudioService_1.AudioService])
], AudioComponent);
exports.AudioComponent = AudioComponent;
//# sourceMappingURL=Audio.Component.js.map