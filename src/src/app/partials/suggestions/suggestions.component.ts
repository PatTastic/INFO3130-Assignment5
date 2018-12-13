import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { ConfigService } from '../../_helpers/config.service';
import { UtilitiesService } from '../../_helpers/utilities.service';
import { ApiService } from '../../_services/api.service';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent implements OnInit {
  private userLoc: any;

  selectedSuggestion: any;
  suggestionTimeframe: any;
  suggestions: any[];
  noData: boolean;
  viewSuggestion: boolean;

  constructor(private _api: ApiService) {
    this.suggestions = [];
    this.noData = false;
    this.userLoc = {};
    this.selectedSuggestion = {};
    this.viewSuggestion = false;

    let from = moment(new Date()).subtract(30, 'days');
    this.suggestionTimeframe = {
      from: from.format('MMMM Do'),
      fromTs: from,
      to: moment(new Date()).format('MMMM Do'),
      toTs: new Date()
    };
  }

  ngOnInit() {
    ConfigService.getUserLatLng().then((userLoc: any) => {
      this.userLoc = userLoc;
      let lastNearby: any = localStorage.getItem('last-nearby-fetch');
      let canContinue = false;

      // determine if we need to regenerate analytics data
      // No = User has not moved at least 10km and 1 hour has not passed
      if (UtilitiesService.doesExist(lastNearby)) {
        lastNearby = JSON.parse(lastNearby);

        let timeDiff = (Date.now() - lastNearby.ts);
        let locDiff = UtilitiesService.distance(lastNearby.loc, this.userLoc);

        if (timeDiff >= 3600000 || locDiff >= 10000 || lastNearby.places == 0) {
          canContinue = true;
        }
      }
      else {
        canContinue = true;
      }

      if (canContinue) {
        this._api.getAllAnalytics().then((analytics: any) => {
          if (analytics !== false && analytics.length > 0) {
            for (let i = 0; i < analytics.length; i++) {
              let search = {
                lat: userLoc.lat,
                lng: userLoc.lng,
                type: analytics[i].type
              };

              // fetch nearby areas
              this._api.getNearbyAreas(search).then((places: any) => {
                let count = (places.length <= 3 ? places.length : 3);
                for (let j = 0; j < count; j++) {
                  let photo = './assets/placeholder.png';
                  if (UtilitiesService.doesExist(places[j].photos)){
                    photo = UtilitiesService.buildGooglePhotoUrl(places[j].photos[0].photo_reference);
                  }

                  // format returned location types
                  let allTypes = UtilitiesService.deepCopy(places[j].types);
                  places[j].types = UtilitiesService.filterOnlyWhitelistedPlaceTypes(places[j].types);
                  for (let k = 0; k < places[j].types.length; k++) {
                    places[j].types[k] = UtilitiesService.toTitleCase(places[j].types[k]);
                  }

                  let typeSpliceAt = (places[j].types.length <= 3 ? places[j].types.length : 3);
                  let types = places[j].types.splice(0, typeSpliceAt);
                  let typeString = types.join(', ');

                  // add to suggestions
                  this.suggestions.push({
                    location: places[j].geometry.location,
                    id: places[j].id,
                    name: places[j].name,
                    rating: places[i].rating,
                    distance: UtilitiesService.distance(this.userLoc, places[j].geometry.location),
                    photo: photo,
                    allTypes: allTypes,
                    types: places[j].types,
                    typesString: typeString
                  });
                }

                // save fetched info
                let lastNearbyFetch = {
                  ts: Date.now(),
                  loc: UtilitiesService.deepCopy(this.userLoc),
                  places: this.suggestions.length
                };
                localStorage.setItem('last-nearby-fetch', JSON.stringify(lastNearbyFetch));
                localStorage.setItem('nearby-places', JSON.stringify(this.suggestions));

                console.log(places);
              }).catch((err) => {
                console.error(err);
              })
            }
          }
          else {
            this.noData = true;
          }
        }).catch((err) => {
          console.error(err);
        })
      }
      else {
        // new data was not fetched, use previously fetched data
        let lastPlaces: any = localStorage.getItem('nearby-places');

        if (UtilitiesService.doesExist(lastPlaces)) {
          lastPlaces = JSON.parse(lastPlaces);
          this.suggestions = lastPlaces;
        }
        else {
          this.noData = true;
        }
      }
    }).catch((err) => {
      console.error(err);
    })
  }

  /**
   * Load Suggestion popover
   *
   * @param {any} suggestion - The selected suggestion
   */
  selectSuggestion(suggestion: any) {
    this.selectedSuggestion = suggestion;
    this.viewSuggestion = true;
  }

  /**
   * Close Suggestion popover
   */
  resetViewSuggestion() {
    this.viewSuggestion = false;
    this.selectedSuggestion = {};
  }
}
