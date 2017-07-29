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
        // counting the loaded audio pieces so we can sync their inits
        this._audioInitCount = 0;
        this._totalAudioComponents = 8;
        this.audioService.getAudioLoadNotification().subscribe(function (id) {
            _this._audioInitCount++;
            console.log(id.id + ' loaded. ' + _this._audioInitCount + ' of 8');
            // if we have all of the components, proceed with initiation
            if (_this._audioInitCount == _this._totalAudioComponents) {
                _this.audioService.initAudioObjects();
            }
        });
    }
    return HomeComponent;
}());
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