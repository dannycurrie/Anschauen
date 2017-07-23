import { Component, Input, ElementRef } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import { AudioService } from '../../Services/AudioService';
import { IAudioObject } from '../../Shared/Interfaces';
import * as D3 from 'd3';

@Component({
    selector: 'my-audio',
    templateUrl: 'components/audio/audio.component.html',
    styleUrls: ['components/audio/audio.component.css']
})
export class AudioComponent {

    _audioId: string;
    audioObject: IAudioObject;
    playing: boolean = false;
    analyser: AnalyserNode;
    frequencyData: Uint8Array;
    parentNativeElement: any;
    svgHeight = 600;
    svgWidth = 960;

    @Input() set audioId(audioId: string){
        this._audioId = audioId;
        this.getAudio(this._audioId);
        // start playing at no volume, to ensure timing is accurate between audio pieces
        this.initAudio();
    }

    constructor(element: ElementRef, private audioService: AudioService) {
        this.parentNativeElement = element.nativeElement;
    }

    getAudio(id: string){
        this.audioService.getAudioObject(id)
        .subscribe((result: IAudioObject) => {
            console.log(JSON.stringify(result));
            this.audioObject = result;
            this.analyser = result.analyser;
        });
    }

    initAudio(){
        this.audioObject.init();
    }


    playAudio(){
        if(this.audioObject && !this.playing){
            this.audioObject.play();
            this.playing = true;
            var svg = D3.select(this.parentNativeElement).append('svg')
                .attr('height', this.svgHeight)
                .attr('width', this.svgWidth);
            this.renderChart(svg);
        }
    }

    stopAudio(){
        if(this.audioObject && this.playing){
            this.audioObject.stop();
            this.playing = false;
            this.audioObject.audioBufferSource.disconnect(this.audioObject.analyser);
        }
    }

    renderChart(svg:any) {
        requestAnimationFrame(()=> this.renderChart(svg));

        // copy frequency data to frequencyData array.
        this.frequencyData = new Uint8Array(200);
        this.analyser.getByteFrequencyData(this.frequencyData);
        var filteredFreqData:number[] = [];
        var i = 0;
        this.frequencyData.forEach(function(element) {
            if(i % 4 == 0){
                console.log(element);
                filteredFreqData.push(element);
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
        .attr('cx', 100 / 2)
        .attr('cy', 100 / 2)
        .attr('stroke', '#000000')
        .attr('fill', 'none');
        //     .attr({
        //         'r': (d: number)=> { return radiusScale(d); },
        //         'c': 100 / 2,
        //         'cy': 100 / 2,
        //         'fill': 'none', 
        //         'stroke-width': 0.5,
        //         'stroke-opacity': 0.3,
        //         'stroke': '#FFFFFF'
        //         //stroke: function(d) { return d3.hsl(hueScale(d), 1, 0.5); }
        //    });

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
    }
}