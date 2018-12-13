import { Component } from '@angular/core';
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

  /**
   * Load newly generated geo data
   */
  loadNewGeo() {
    let geo: any = localStorage.getItem('new-points');
    let notToday = [];

    if (UtilitiesService.doesExist(geo)) {
      geo = JSON.parse(geo);
      let today = UtilitiesService.convertDateToUniformDate(new Date().toString());
      let analytics = {};

      // split data into two arrays, todays data and previous data
      for (let i = (geo.length - 1); i >= 0; i--) {
        if (geo != today) {
          notToday.push(geo[i]);
          geo.splice(i, 1);
        }
      }

      let completedAnalytics = ';';
      for (let i = 0; i < notToday.length; i++) {
        // gather geopoints into list of weighted regions
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

        // check if region makes the cut to be used in analytics
        if (analytics.hasOwnProperty(notToday[i].groupId)) {
          if (analytics[notToday[i].groupId] > 10 && completedAnalytics.indexOf(notToday[i].groupId) < 0) {
            completedAnalytics += notToday[i].groupId + ';';

            // get more data about region
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
        
        this._api.saveGeoPoint(notToday[i]);
      }

      localStorage.setItem('new-points', JSON.stringify(geo));
    }
  }

  /**
   * Loads in demo data
   * Triggered by typing 'demoData()' in a web browser console
   */
  demoData() {
    let haveTestData: any = localStorage.getItem('got-test-data');

    if (UtilitiesService.doesExist(haveTestData)) {
      // user already generated demo data
      console.log('Looks like you\'ve already loaded in the demo data!');
      console.log('Demo data ranges from December 3rd to December 7th, 2018.');
    }
    else {
      console.log('Loading demo data...');

      // load demo data
      this._api.getTestData().then((res: any) => {
        if (res !== false) {
          // load demo data
          localStorage.setItem('new-points', JSON.stringify(res));
          localStorage.setItem('got-test-data', 'true');
          this.loadNewGeo();
          
          console.log('Only data points will be loaded, all suggestions/stats/analytics are generated dynamically.');
          console.log('Demo data ranges from December 3rd to December 7th, 2018.');
          console.log('');
          console.log('The website will reload in 1 minute. Please wait');
          
          setTimeout(() => {
            // page must be reload for data to take effect
            console.log('');
            console.log('Reloading page...');
            window.location.reload();
          }, 60000);
        }
        else {
          console.log('Demo data could not be loaded');
          console.log('Error: ', res);
        }
      }).catch((err) => {
        console.log('Demo data could not be loaded');
        console.log('Error: ', err);
      })
    }
  }
}
