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
        this.svgHeight = 630;
        this.svgWidth = 0;
        this.strokeColour = "#FFFFFF";
        this.colourCounter = 0;
        this.parentNativeElement = element.nativeElement;
        this.analyser = audioService.getAnalyser();
    }
    AudioVizComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log('subscribing to endofbar in viz');
        this.audioService.endOfBarSubject.subscribe(function (message) {
            console.log('end of bar message: ' + JSON.stringify(message));
            if (message.message == 'endOfBar') {
                _this.switchColours();
            }
        });
        var svg = D3.select(this.parentNativeElement).append('svg')
            .attr('height', 650)
            .attr('width', this.parentNativeElement.width)
            .attr('class', 'row col-xs-12');
        this.renderChart(svg);
    };
    AudioVizComponent.prototype.renderChart = function (svg) {
        var _this = this;
        var domNode = svg.node();
        this.svgWidth = parseInt(D3.select(domNode).style("width"));
        requestAnimationFrame(function () { return _this.renderChart(svg); });
        // copy frequency data to frequencyData array.
        this.frequencyData = new Uint8Array(200);
        this.analyser.getByteFrequencyData(this.frequencyData);
        var filteredFreqData = [];
        var evenMoreFilteredData = [];
        var i = 0;
        // filter the fequency data to give a more impactful/less cluttered viz
        this.frequencyData.forEach(function (element) {
            if (i % 4 == 0) {
                filteredFreqData.push(element);
            }
            if (i % 9 == 0) {
                evenMoreFilteredData.push(element);
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
            .attr('cx', this.svgWidth / 2)
            .attr('cy', this.svgHeight / 2)
            .attr('stroke', this.strokeColour)
            .attr('fill', 'none');
        circles.exit().remove();
        //text
        var texts = svg.selectAll('text')
            .data(evenMoreFilteredData);
        texts.enter().append('text');
        var textCount = 0;
        texts
            .attr("x", function (d) {
            if (d % 2 == 0)
                return _this.svgWidth / 2 - radiusScale(d);
            else
                return _this.svgWidth / 2 + radiusScale(d) - (d / 2);
        })
            .attr("y", function (d) {
            return _this.svgHeight / 2;
        })
            .text(function (d) {
            var anchauen = "ĄŊşÇĦȺȗǝȵ";
            return anchauen[9 - Math.floor((d / D3.max(evenMoreFilteredData) * 9))];
        })
            .attr("font-family", "sans-serif")
            .attr("font-size", function (d) { return d; })
            .attr("fill", this.strokeColour);
        texts.exit().remove();
    };
    AudioVizComponent.prototype.switchColours = function () {
        console.log("switching colours");
        if (this.colourCounter == 1) {
            D3.select("body").transition().duration(500).style("background", "#262626");
            this.colourCounter = 0;
            this.strokeColour = "#FFFFFF";
        }
        else {
            D3.select("body").transition().duration(500).style("background", "#F8E8E8");
            this.colourCounter = 1;
            this.strokeColour = "#000000";
        }
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