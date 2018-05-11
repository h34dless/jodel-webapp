import {Component, Input, OnInit, SimpleChange} from '@angular/core';
import {RelatedJodelModel} from "./related-jodel.model";
import {relatedJodel} from "./mock-related-jodel";

@Component({
    selector: 'app-related-jodel',
    templateUrl: './related-jodel.component.html'
})
export class RelatedJodelComponent implements OnInit {

    @Input() relatedJodel: RelatedJodelModel;

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChange) {

    }
}
