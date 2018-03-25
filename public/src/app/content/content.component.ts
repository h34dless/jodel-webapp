import {Component, OnInit} from '@angular/core';
import {ContentService} from '../content.service';
import {CONTENTTYPE} from "../global/contenttype";
import {Contentpage} from "./content-page.model";
import {ContentModel} from "./content.model";
/**
 * content component
 *  - Requests data from the service and forwards
 *  them to the content components
 *
 * @author  Maya
 * @since   23.03.2018
 */
@Component({
    selector: 'app-content',
    templateUrl: './content.component.html'
})

export class ContentComponent implements OnInit {

    CONTENTTYPE = CONTENTTYPE;

    data: ContentModel;

    constructor(private contentService: ContentService) { }

    /**
     * on init
     *
     * @author  Maya
     * @since   23.03.2018
     */
    ngOnInit() {

        // get content data
        this.getData();
    }


    /**
     * get data from service
     *
     * @author  Maya
     * @since   23.03.2018
     */
    getData(): void {
        this.contentService.getResultData()
            .subscribe(response => {
                this.data = response;
            });
    }

}