import { Component, OnInit, Input } from '@angular/core';

import { ApiService } from '../../_services/api.service';
import { UtilitiesService } from '../../_helpers/utilities.service';

@Component({
  selector: 'app-view-suggestion',
  templateUrl: './view-suggestion.component.html',
  styleUrls: ['./view-suggestion.component.css']
})
export class ViewSuggestionComponent implements OnInit {
  @Input('suggestion') suggestion: any;

  staticMap: string;

  constructor(private _api: ApiService) {
    this.staticMap = '';
  }

  ngOnInit() {
    for (let i = 0; i < this.suggestion.allTypes.length; i++) {
      this.suggestion.allTypes[i] = UtilitiesService.toTitleCase(this.suggestion.allTypes[i]);
    }

    // fetch static map
    this._api.getStaticMap(
      this.suggestion.location.lat,
      this.suggestion.location.lng,
      [this.suggestion.location]
    ).then((res) => {
      if (UtilitiesService.doesExist(res)) {
        this.staticMap = 'url(' + res + ')';
      }
    })
  }
}
