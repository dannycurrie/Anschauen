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
var AudioService_1 = require("../../Services/AudioService");
require("rxjs/add/operator/map");
var HomeComponent = (function () {
    function HomeComponent(audioService) {
        var _this = this;
        this.audioService = audioService;
        this.dark = false;
        this.light = true;
        this.stopAll = new core_1.EventEmitter();
        // counting the loaded audio pieces so we can sync their inits
        this._audioInitCount = 0;
        this._totalAudioComponents = 8;
        this.audioService.audioLoadSubject.subscribe(function (message) {
            console.log('audio load message: ' + JSON.stringify(message));
            if (message.message == 'audioLoaded') {
                _this._audioInitCount++;
                console.log(message.value + ' loaded. ' + _this._audioInitCount + ' of 8');
                // if we have all of the components, proceed with initiation
                if (_this._audioInitCount == _this._totalAudioComponents) {
                    _this.audioService.initAudioObjects(true);
                    _this.intialiseTrackDefault();
                }
            }
        });
        this.audioService.endOfBarSubject.subscribe(function (message) {
            console.log('end of bar: ' + JSON.stringify(message));
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
    // hard coded initialisation
    HomeComponent.prototype.intialiseTrackDefault = function () {
        // this is hacky - should replace with an event based workflow when I figure out how
        var _this = this;
        this.audioService.audioObjects.forEach(function (audio) {
            // half speed main piano
            if (audio.id == 'mainpiano')
                audio.audioBufferSource.playbackRate.value = 0.5;
            // init default instruments
            if (audio.id == 'bass' || audio.id == 'mainpiano' || audio.id == 'synth' || audio.id == 'drummedglitch') {
                audio.audioBufferSource.connect(_this.audioService.analyser);
                audio.play();
            }
        });
    };
    HomeComponent.prototype.syncAudioPieces = function () {
        console.log('syncing audio');
        this.audioService.initAudioObjects(false);
    };
    HomeComponent.prototype.stopAllAudio = function () {
        this.stopAll.emit("stop");
    };
    return HomeComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], HomeComponent.prototype, "stopAll", void 0);
HomeComponent = __decorate([
    core_1.Component({
        selector: 'my-home',
        templateUrl: 'components/home/home.component.html',
        styleUrls: ['components/home/home.component.css']
    }),
    __metadata("design:paramtypes", [AudioService_1.AudioService])
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map