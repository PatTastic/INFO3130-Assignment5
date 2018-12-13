import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from '../_helpers/config.service';

@Injectable()
export class DataService {

  constructor(private _http: HttpClient) { }

  /**
   * Get all places nearby a lat lng point
   *
   * @param {any} place - An object that contains 'lat' and 'lng' attributes
   */
  getNearbyAreas(place: any) {
    return this._http.get(this.hackCors() + 'place/nearbysearch/json'
      + '?location=' + place.lat.toString() + ',' + place.lng.toString()
      + '&rankby=prominence'
      + '&radius=5000'
      + '&type=' + place.type
      + '&key=' + ConfigService.googleMapsKey
    ).toPromise();
  }

  /**
   * Get the releated address from a lat lng point
   *
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   */
  getGeocoding(lat: number, lng: number) {
    return this._http.get(this.hackCors() + 'geocode/json'
      + '?latlng=' + lat.toString() + ',' + lng.toString()
      + '&key=' + ConfigService.googleMapsKey
    ).toPromise();
  }

  /**
   * Get a static map centered on a lat lng point
   * Can also include markers
   *
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {string} markers - Genereated in API service
   */
  getStaticMap(lat: number, lng: number, markers: string) {
    return this._http.get('https://maps.googleapis.com/maps/api/staticmap'
      + '?center=' + lat.toString() + ',' + lng.toString()
      + '&zoom=16'
      + '&size=1000x1000'
      + '&scale=1'
      + markers
      + '&key=' + ConfigService.googleMapsKey,
      { responseType: 'blob' }
    ).toPromise();
  }

  /**
   * PRIVATE FUNCTION
   * A sneaky way to test on localhost
   */
  private hackCors() {
    let url = 'https://maps.googleapis.com/maps/api/';
    if (window.location.hostname == 'localhost') {
      url = 'https://cors.io/?' + url;
    }
    return url;
  }
}
