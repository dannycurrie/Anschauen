import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'test',
    templateUrl: 'components/test/test.component.html',
    styleUrls: ['components/test/test.component.css']
})
export class TestComponent {
    name: string = "TEST";
    param: string;

    constructor(private params: ActivatedRoute) {
        params.params
            .subscribe((data: { id?: string}) => this.param = data.id);
    }
}