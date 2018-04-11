import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {TimeModel} from "../../time-content/time.model";
import {ContentService} from "../../../../content.service";
import {animate, query, stagger, state, style, transition, trigger} from "@angular/animations";
import {COLORS} from "../../../../global/colors";
/**
 * time chart component
 *
 * @author  Maya
 * @since   28.03.2018
 */
@Component({
    selector: 'app-time-chart',
    templateUrl: './time-chart.component.html',
    animations: [

        trigger('timeChartState', [
            state("a", style({})),
            state("b", style({})),
            transition("* => *", [
                query(":enter .animation", [
                    style({
                        backgroundColor: COLORS.lightGrey,
                        width: '8px',
                        height: '8px',
                        marginTop: '4px'
                    }),
                    stagger(8, [
                        animate(1)
                    ]),
                ], {optional: true})
            ]),
        ])
    ]
})
export class TimeChartComponent implements OnInit {

    hours = new Array(24);
    maxValue = new Array(12);
    maxValueArray = [];

    infoText: string;

    convertedValues: TimeModel["value"];
    convertedValuesArrays = [];

    colors = COLORS;

    @Input() color: string;

    @Input() timeModel: TimeModel;

    triggerValue = 'a';

    constructor(private contentService: ContentService) {}


    /**
     * @author  Maya
     * @since   28.03.2018
     */
    ngOnInit() {
        this.color = this.color || this.contentService.color;
        this.triggerValue = this.triggerValue == 'a' ? 'b' : 'a';
    }


    /**
     * @author  Maya
     * @since   28.03.2018
     */
    ngOnChanges(changes: SimpleChanges) {

        if (changes.timeModel) {
            this.updateConvertedValues();
            this.updateInfoBox(null);
            this.triggerValue = this.triggerValue == 'a' ? 'b' : 'a';
        }
    }


    /**
     * @author  Maya
     * @since   28.03.2018
     */
    updateConvertedValues() {

        this.hours = new Array(this.timeModel.value.length);
        this.convertedValues = this.convertValuesForChart();
    }


    updateInfoBox(hour) {

        if (hour == null) {
            this.infoText = '12 - 13 Uhr (24)'

        } else {
            this.infoText = hour + ' - ' + (hour+1) + ' Uhr (' + this.timeModel.value[hour] + ')';
        }

        console.log('hour chart event', event);
    }


    /**
     * round percentage number [0,100] to [0, maxValue]
     *
     * @author  Maya
     * @since   28.03.2018
     */
    convertValuesForChart() {

        let convertedValues = [];
        let factor = 100 / this.maxValue.length;

        for (let i = 0; i < this.hours.length; i++) {

            convertedValues[i] = this.maxValue.length - Math.round(this.timeModel.value[i] / factor);
            this.convertedValuesArrays[i] = new Array(convertedValues[i]);
            this.maxValueArray[i] = new Array(this.maxValue.length - convertedValues[i]);
        }

        return convertedValues;
    }

}
