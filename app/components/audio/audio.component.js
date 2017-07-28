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
        this.audioService = audioService;
        this.playing = false;
    }
    Object.defineProperty(AudioComponent.prototype, "audioId", {
        set: function (audioId) {
            this._audioId = audioId;
            this.getAudio(this._audioId);
            // start playing at no volume, to ensure timing is accurate between audio pieces
            this.initAudio();
        },
        enumerable: true,
        configurable: true
    });
    AudioComponent.prototype.getAudio = function (id) {
        var _this = this;
        this.audioService.getAudioObject(id)
            .subscribe(function (result) {
            console.log(JSON.stringify(result));
            _this.audioObject = result;
        });
    };
    AudioComponent.prototype.initAudio = function () {
        this.audioObject.init();
    };
    AudioComponent.prototype.playAudio = function () {
        if (this.audioObject && !this.playing) {
            this.audioObject.play();
            this.audioObject.audioBufferSource.connect(this.audioService.analyser);
            this.playing = true;
        }
    };
    AudioComponent.prototype.stopAudio = function () {
        if (this.audioObject && this.playing) {
            this.audioObject.stop();
            this.playing = false;
            this.audioObject.audioBufferSource.disconnect(this.audioService.analyser);
        }
    };
    return AudioComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], AudioComponent.prototype, "audioId", null);
AudioComponent = __decorate([
    core_1.Component({
        selector: 'my-audio',
        templateUrl: 'components/audio/audio.component.html',
        styleUrls: ['components/audio/audio.component.css']
    }),
    __metadata("design:paramtypes", [AudioService_1.AudioService])
], AudioComponent);
exports.AudioComponent = AudioComponent;
//# sourceMappingURL=audio.component.js.map