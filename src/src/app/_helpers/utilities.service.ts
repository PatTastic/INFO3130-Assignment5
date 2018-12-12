import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as haversine from 'haversine-distance';
import { ConfigService } from './config.service';

@Injectable()
export class UtilitiesService {
  /**
   * Create a deep copy of a variable
   *
   * @param {any} elem - Variable to copy
   */
  static deepCopy(elem: any) {
    return JSON.parse(JSON.stringify(elem));
  }

  /**
   * Check if a variable exists
   *
   * @param {any} elem - Variable to check
   */
  static doesExist(elem: any) {
    return !(typeof elem == 'undefined' || elem == null);
  }

  /**
   * Convert any date representation to our internal date format
   *
   * @param {string} date - Date representation
   */
  static convertDateToUniformDate(date: string) {
    return moment(new Date(date)).format(ConfigService.internalDateFormat);
  }

  /**
   * Get the distance between two sets of lat lng points
   *
   * @param {any} coords1 - Lat lng set 1
   * @param {any} coords2 - Lat lng set 2
   * @param {boolean} inKilometers - Return value in kilometers (or meters if false)
   */
  static distance(coords1: any, coords2: any, inKilometers: boolean = false) {
    let d = haversine(coords1, coords2);

    if (inKilometers) {
      d = (d / 1000);
    }

    return d;
  }

  /**
   * Generate a random ID
   *
   * @param {number} length - Number of characters to generate
   */
  static generateRandomID(length: number = 10) {
    let id = '';
    let possibilities = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      id += possibilities.charAt(Math.floor(Math.random() * possibilities.length));
    }

    return id;
  }

  /**
   * Compress all location types into one array
   * 
   * @param {any} place - Google Maps place object
   */
  static getPlaceTypesFromPlace(place: any) {
    let types = [];

    if (this.doesExist(place.results)) {
      if (this.doesExist(place.results[0])) {
        if (this.doesExist(place.results[0].types)) {
          for (let i = 0; i < place.results.length; i++) {
            for (let j = 0; j < place.results[i].types.length; j++) {
              let found = false;

              for (let k = 0; k < types.length; k++) {
                if (place.results[i].types[j] == types[k]) {
                  found = true;
                  break;
                }
              }

              if (!found) {
                types.push(place.results[i].types[j]);
              }
            }
          }
        }
      }
    }

    return types;
  }

  /**
   * Get only the whitelisted location types as a string
   * @param {any[]} types - All types
   */
  static getMostProminentPlaceType(types: any[]) {
    let whitelist = ConfigService.getWhitelistedPlaceTypes();
    let type = '';

    for (let i = 0; i < types.length; i++) {
      for (let j = 0; j < whitelist.length; j++) {
        if (types[i] == whitelist[j]) {
          type = types[i];
          break;
        }
      }

      if (type != '') {
        break;
      }
    }

    return type;
  }

  /**
   * Return only whitelisted location types
   *
   * @param {any[]} types - All types
   */
  static filterOnlyWhitelistedPlaceTypes(types: any[]) {
    let whitelist = ConfigService.getWhitelistedPlaceTypes();

    for (let i = (types.length - 1); i >= 0; i--) {
      let found = false;
      for (let j = 0; j < whitelist.length; j++) {
        if (types[i] == whitelist[j]) {
          found = true;
        }
      }

      if (!found) {
        types.splice(i, 1);
      }
    }

    return types;
  }

  /**
   * Build a Google Maps photos URL
   *
   * @param {string} photoRef - Google Maps photo reference
   * @param {number} maxWidth - Width of photo
   */
  static buildGooglePhotoUrl(photoRef: string, maxWidth: number = 300) {
    let url = 'https://maps.googleapis.com/maps/api/place/photo'
      + '?maxwidth=' + maxWidth.toString()
      + '&photoreference=' + photoRef
      + '&sensor=false'
      + '&key=' + ConfigService.googleMapsKey;

    return url;
  }

  /**
   * Convert a string to Title Case
   *
   * @param {string} word - Word to convert
   */
  static toTitleCase(word: string) {
    word = word.replace(/_/g, ' ');
    return word.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
}
