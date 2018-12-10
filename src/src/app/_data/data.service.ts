import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from '../_helpers/config.service';

@Injectable()
export class DataService {

  constructor(private _http: HttpClient) { }

  getNearbyAreas(place: any) {
    return this._http.get(this.hackCors() + 'place/nearbysearch/json'
      + '?location=' + place.lat.toString() + ',' + place.lng.toString()
      + '&rankby=prominence'
      + '&radius=5000'
      + '&type=' + place.type
      + '&key=' + ConfigService.googleMapsKey
    ).toPromise();
  }

  getGeocoding(lat: number, lng: number) {
    return this._http.get(this.hackCors() + 'geocode/json'
      + '?latlng=' + lat.toString() + ',' + lng.toString()
      + '&key=' + ConfigService.googleMapsKey
    ).toPromise();
  }

  private hackCors() {
    let url = 'https://maps.googleapis.com/maps/api/';
    if (window.location.hostname == 'localhost') {
      url = 'https://cors.io/?' + url;
    }
    return url;
  }
}
