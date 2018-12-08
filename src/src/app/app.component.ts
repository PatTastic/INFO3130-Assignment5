import { Component } from '@angular/core';

import { ApiService } from './_services/api.service';
import { UtilitiesService } from './_helpers/utilities.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private _api: ApiService) {
    
  }

  loadNewGeo() {
    let geo: any = localStorage.getItem('new-points');
    let notToday = [];

    if (UtilitiesService.doesExist(geo)) {
      geo = JSON.parse(geo);
      let today = UtilitiesService.convertDateToUniformDate(new Date().toString());

      for (let i = (geo.length - 1); i >= 0; i--) {
        if (geo != today) {
          notToday.push(geo);
          geo.splice(i, 1);
        }
      }

      for (let i = 0; notToday.length; i++) {
        this._api.saveGeoPoint(notToday[i]);
      }

      localStorage.setItem('new-points', JSON.stringify(geo));
    }

    console.log('geo', geo);
  }
}
