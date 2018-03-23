import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {ResultModel} from './content/result-content/result.model';
import {RESULT} from './content/result-content/mock-results';

@Injectable()
export class ContentService {

    color: string;

    constructor() {
        this.color = 'green'
    }


    /**
     * get data from mock result to fake http request
     *
     * @author  Maya
     * @since   23.03.2018
     */
    static getResultData(): Observable<ResultModel> {

        return of(RESULT);
    }
}
