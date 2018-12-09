﻿import { Component } from '@angular/core';
import * as haversine from 'haversine-distance';

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
    this.loadNewGeo();
  }

  loadNewGeo() {
    let geo: any = localStorage.getItem('new-points');
    let notToday = [];

    if (UtilitiesService.doesExist(geo)) {
      geo = JSON.parse(geo);
      let today = UtilitiesService.convertDateToUniformDate(new Date().toString());
      let analytics = {};

      for (let i = (geo.length - 1); i >= 0; i--) {
        if (geo != today) {
          notToday.push(geo[i]);
          geo.splice(i, 1);
        }
      }

      let completedAnalytics = ';';
      for (let i = 0; i < notToday.length; i++) {
        // generate analytics
        if (i == 0) {
          notToday[i].groupId = UtilitiesService.generateRandomID();
          analytics[notToday[i].groupId] = 1;
        }
        else if (i < notToday.length) {
          for (let j = 0; j < notToday.length; j++) {
            if (i != j) {
              let distance = haversine(notToday[j], notToday[i]);

              if (distance < 15) {
                if (UtilitiesService.doesExist(notToday[j].groupId) && notToday[j].groupId != '') {
                  notToday[i].groupId = notToday[j].groupId;
                  analytics[notToday[i].groupId]++;
                  break;
                }
              }
            }
          }

          if (!UtilitiesService.doesExist(notToday[i].groupId) || notToday[i].groupId == '') {
            notToday[i].groupId = UtilitiesService.generateRandomID();
            analytics[notToday[i].groupId] = 1;
          }
        }
        
        if (analytics.hasOwnProperty(notToday[i].groupId)) {
          if (analytics[notToday[i].groupId] > 10 && completedAnalytics.indexOf(notToday[i].groupId) < 0) {
            completedAnalytics += notToday[i].groupId + ';';
            this._api.getGeocodingFromCoords(notToday[i]).then((res: any) => {
              let placeTypes = UtilitiesService.getPlaceTypesFromPlace(res);
              let type = UtilitiesService.getMostProminentPlaceType(placeTypes);

              if (type != '') {
                let analytic = {
                  type: type,
                  averageCost: 0,
                  averageRating: 0,
                  numberOfCosts: 0,
                  numberOfRatings: 0
                };

                this._api.addToAnalytics(analytic);
              }
            })
          }
        }
        
        //this._api.saveGeoPoint(notToday[i]);
      }

      //localStorage.setItem('new-points', JSON.stringify(geo));
    }

    console.log('geo', geo);
  }
}
