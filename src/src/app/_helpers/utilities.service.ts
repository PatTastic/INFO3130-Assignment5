import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { ConfigService } from './config.service';

@Injectable()
export class UtilitiesService {
  static deepCopy(elem: any) {
    return JSON.parse(JSON.stringify(elem));
  }

  static doesExist(elem: any) {
    return !(typeof elem == 'undefined' || elem == null);
  }

  static convertDateToUniformDate(date: string) {
    return moment(new Date(date)).format(ConfigService.internalDateFormat);
  }

  static distance(coords1: any, coords2: any, inKilometers: boolean = false) {
    function toRad(x) {
      return x * Math.PI / 180;
    }

    let x1 = coords2.lat - coords1.lat;
    let dLat = toRad(x1);

    let x2 = coords2.lng - coords1.lng;
    let dLng = toRad(x2);

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coords1.lat)) * Math.cos(toRad(coords2.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let d = c;
    if (inKilometers) {
      d = 6371 * c;
    }

    return d;
  }

  static generateRandomID(length: number = 10) {
    let id = '';
    let possibilities = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      id += possibilities.charAt(Math.floor(Math.random() * possibilities.length));
    }

    return id;
  }

  static getPlaceTypesFromPlace(place: any) {
    let types = [];

    if (this.doesExist(place.results)) {
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

    return types;
  }

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

  static buildGooglePhotoUrl(photoRef: string, maxWidth: number = 300) {
    let url = 'https://maps.googleapis.com/maps/api/place/photo'
      + '?maxwidth=' + maxWidth.toString()
      + '&photoreference=' + photoRef
      + '&sensor=false'
      + '&key=' + ConfigService.googleMapsKey;

    return url;
  }

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
