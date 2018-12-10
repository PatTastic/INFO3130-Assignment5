import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { ConfigService } from '../../_helpers/config.service';
import { ApiService } from '../../_services/api.service';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent implements OnInit {
  suggestionTimeframe: any;
  suggestions: any[];

  constructor(private _api: ApiService) {
    this.suggestionTimeframe = {
      from: moment(new Date()).subtract(30, 'days').format('MMMM Do'),
      to: moment(new Date()).format('MMMM Do')
    };
  }

  ngOnInit() {
    this._api.getDaysInRange(this.suggestionTimeframe.from, this.suggestionTimeframe.to).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.error(err);
    })
  }
}
