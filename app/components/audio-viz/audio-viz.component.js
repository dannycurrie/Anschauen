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
var D3 = require("d3");
var AudioVizComponent = (function () {
    function AudioVizComponent(element, audioService) {
        this.audioService = audioService;
        this.svgHeight = 600;
        this.svgWidth = 960;
        this.parentNativeElement = element.nativeElement;
        this.analyser = audioService.getAnalyser();
    }
    AudioVizComponent.prototype.ngOnInit = function () {
        var svg = D3.select(this.parentNativeElement).append('svg')
            .attr('height', this.svgHeight)
            .attr('width', this.svgWidth);
        this.renderChart(svg);
    };
    AudioVizComponent.prototype.renderChart = function (svg) {
        var _this = this;
        requestAnimationFrame(function () { return _this.renderChart(svg); });
        // copy frequency data to frequencyData array.
        this.frequencyData = new Uint8Array(200);
        this.analyser.getByteFrequencyData(this.frequencyData);
        var filteredFreqData = [];
        var i = 0;
        // filter the fequency data to give a more impactful/less cluttered viz
        this.frequencyData.forEach(function (element) {
            if (i % 4 == 0) {
                filteredFreqData.push(element);
            }
            i++;
        }, this);
        // scale things to fit
        var radiusScale = D3.scaleLinear()
            .domain([0, D3.max(filteredFreqData)])
            .range([0, this.svgWidth / 2 - 10]);
        var hueScale = D3.scaleLinear()
            .domain([200, 207])
            .range([0, 1]);
        // update d3 chart with new data
        var circles = svg.selectAll('circle')
            .data(filteredFreqData);
        circles.enter().append('circle');
        circles
            .attr("r", function (d) { return radiusScale(d); })
            .attr('cx', 100 / 2)
            .attr('cy', 100 / 2)
            .attr('stroke', '#000000')
            .attr('fill', 'none');
        circles.exit().remove();
        //text
        // var texts = svg.selectAll('text')
        //     .data(filteredFreqData);
        // texts.enter().append('text');
        // texts
        //     .attr("x", function(d){ 
        //         if(d % 2 == 0)
        //             return svgWidth/2 - radiusScale(d);
        //         else
        //             return svgWidth/2 + radiusScale(d) - (d / 2);
        //     })
        //     .attr("y", function(d){
        //          if(d % 2 == 0)
        //             return svgHeight/2 - d; 
        //         else
        //             return svgHeight/2 + d; 
        //         })
        //     .text(function(d){ return String.fromCharCode(97 + (d/2)); })
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", function(d) { return d / 2; } )
        //     .attr("fill", colour);
        // texts.exit().remove();
    };
    return AudioVizComponent;
}());
AudioVizComponent = __decorate([
    core_1.Component({
        selector: 'audio-viz',
        templateUrl: 'components/audio-viz/audio-viz.component.html',
        styleUrls: ['components/audio-viz/audio-viz.component.css']
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, AudioService_1.AudioService])
], AudioVizComponent);
exports.AudioVizComponent = AudioVizComponent;
//# sourceMappingURL=audio-viz.component.js.map