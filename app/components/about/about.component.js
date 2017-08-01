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
var AboutComponent = (function () {
    function AboutComponent(audioService) {
        var _this = this;
        this.audioService = audioService;
        this.light = true;
        this.dark = false;
        this.audioService.endOfBarSubject.subscribe(function (message) {
            console.log('end of bar message in aboutcomponent: ' + JSON.stringify(message));
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
    return AboutComponent;
}());
AboutComponent = __decorate([
    core_1.Component({
        selector: 'my-about',
        templateUrl: 'components/about/about.component.html',
        styleUrls: ['components/about/about.component.css']
    }),
    __metadata("design:paramtypes", [AudioService_1.AudioService])
], AboutComponent);
exports.AboutComponent = AboutComponent;
//# sourceMappingURL=about.component.js.map