import { Component, ElementRef } from '@angular/core'
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import { AudioService } from '../../Services/AudioService';
import { IAudioObject } from '../../Shared/Interfaces';
import { AudioComponent } from '../audio/audio.component'
import * as D3 from 'd3';

@Component({
    selector: 'audio-viz',
    templateUrl: 'components/audio-viz/audio-viz.component.html',
    styleUrls: ['components/audio-viz/audio-viz.component.css']
})

export class AudioVizComponent {

    parentNativeElement: any;
    svgHeight = 630;
    svgWidth = 0;
    analyser: AnalyserNode;
    frequencyData: Uint8Array;
    strokeColour:string = "#000000";
    colourCounter:number = 0;

   constructor(element: ElementRef, private audioService: AudioService) {
        this.parentNativeElement = element.nativeElement;
        this.analyser = audioService.getAnalyser();
    }

    ngOnInit(){

        console.log('subscribing to endofbar in viz');
        this.audioService.endOfBarSubject.subscribe(
                message => {
                    console.log('end of bar message: ' + JSON.stringify(message));
                    if(message.message == 'endOfBar'){
                        this.switchColours();
                }
            }
        );

        var svg = D3.select(this.parentNativeElement).append('svg')
                .attr('height', 650)
                .attr('width', this.parentNativeElement.width)
                .attr('class', 'row col-xs-12');
        this.renderChart(svg);
    }

    renderChart(svg:any) {
        var domNode = svg.node();
        this.svgWidth = parseInt(D3.select(domNode).style("width"));

        requestAnimationFrame(()=> this.renderChart(svg));

        // copy frequency data to frequencyData array.
        this.frequencyData = new Uint8Array(200);
        this.analyser.getByteFrequencyData(this.frequencyData);
        var filteredFreqData:number[] = [];
        var evenMoreFilteredData:number[] = [];
        var i = 0;
        // filter the fequency data to give a more impactful/less cluttered viz
        this.frequencyData.forEach(function(element) {
            if(i % 4 == 0){
                filteredFreqData.push(element);
            }
            if(i % 9 == 0){
                evenMoreFilteredData.push(element);
            }
            i++;
        }, this);

        // scale things to fit
        var radiusScale = D3.scaleLinear()
            .domain([0, D3.max(filteredFreqData)])
            .range([0, this.svgWidth/2 -10]);

        var hueScale = D3.scaleLinear()
            .domain([200, 207])
            .range([0, 1]);

       // update d3 chart with new data
       var circles = svg.selectAll('circle')
           .data(filteredFreqData);

        circles.enter().append('circle');

        circles
        .attr("r", (d: number) => {return radiusScale(d)})
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
            .attr("x", (d: number) => { 
                if(d % 2 == 0)
                    return this.svgWidth/2 - radiusScale(d);
                else
                    return this.svgWidth/2 + radiusScale(d) - (d / 2);
            })
            .attr("y", (d: number) => {
                    return this.svgHeight/2; 
                })
            .text((d: number) => {
                 var anchauen = "ĄŊşÇĦȺȗǝȵ";
                 return anchauen[9 - Math.floor((d / D3.max(evenMoreFilteredData) * 9))];
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", (d: number) =>  { return d; } )
            .attr("fill", this.strokeColour);

        texts.exit().remove();
    }

    switchColours(){ 
        console.log("switching colours");
        if(this.colourCounter == 1){
            D3.select("body").transition().duration(500).style("background", "#262626");
            this.colourCounter = 0;
            this.strokeColour = "#FFFFFF";
        }else{
            D3.select("body").transition().duration(500).style("background", "#F8E8E8");
            this.colourCounter = 1;
            this.strokeColour = "#000000";
        }
    }
}