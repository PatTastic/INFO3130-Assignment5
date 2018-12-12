import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

import { UtilitiesService } from '../_helpers/utilities.service';
import { DatabaseService } from '../_data/database.service';
import { DataService } from '../_data/data.service';

@Injectable()
export class ApiService {

  constructor(
    private _data: DataService,
    private _database: DatabaseService
  ) { }

  ////////// JSON Files //////////

  /**
   * Load test/demo data from json file
   */
  getTestData() {
    return new Promise((resolve, reject) => {
      this._database.getTestData().then((res: any) => {
        res = this.formatSelectArray(res);
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  ////////// Local Database //////////

  /**
   * Get all days where data exists
   */
  getActiveDays() {
    return new Promise((resolve, reject) => {
      this._database.getActiveDays().then((res: any) => {
        res = this.formatSelectArray(res);

        // only use the date string
        for (let i = 0; i < res.length; i++) {
          res[i] = res[i].day;
        }

        // add todays date
        res.push(UtilitiesService.convertDateToUniformDate(new Date().toString()));

        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /**
   * Get activity for a specific day
   *
   * @param {string} date - Day to get data for
   */
  getDay(date: string) {
    return new Promise((resolve, reject) => {
      this._database.getDay(date).then((res: any) => {
        res = this.formatSelectArray(res);
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /**
   * Get activity for days in a range
   *
   * @param {string} from - Timestamp of start date
   * @param {string} to - Timestamp of end date
   */
  getDaysInRange(from: string, to: string) {
    return new Promise((resolve, reject) => {
      // create timestamps from strings
      let fromTs = (Date.parse(new Date(from).toDateString())).toString();
      let toTs = (Date.parse(new Date(to).toDateString())).toString();

      this._database.getDaysInRange(fromTs, toTs).then((res: any) => {
        res = this.formatSelectArray(res);
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /**
   * Save a geo point
   *
   * @param {any} point - A geopoint
   */
  saveGeoPoint(point: any) {
    return new Promise((resolve, reject) => {
      this._database.saveGeoPoint(point).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /**
   * Update the weight of a previously-added geopoint
   *
   * @param {any} point - A geopoint with updated weight
   */
  updateGeoPointWeight(point: any) {
    return new Promise((resolve, reject) => {
      this._database.updateGeoPointWeight(point).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /**
   * Update the address of a previously-added geopoint
   *
   * @param {any} point - A geopoint with updated address
   */
  updateGeoPointAddress(point: any) {
    return new Promise((resolve, reject) => {
      this._database.updateGeoPointAddress(point).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /**
   * Get all analytics
   */
  getAllAnalytics() {
    return new Promise((resolve, reject) => {
      this._database.getAllAnalytics().then((res: any) => {
        res = this.formatSelectArray(res);
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /**
   * Get analytics for a specific location type
   *
   * @param {string} type - Location type
   */
  getAnalyticType(type: string) {
    return new Promise((resolve, reject) => {
      this._database.getAnalyticType(type).then((res: any) => {
        res = this.formatSelectArray(res);
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /**
   * Save new analytics row
   *
   * @param {any} analytics - New analytics object
   */
  addToAnalytics(analytics: any) {
    return new Promise((resolve, reject) => {
      // check if analytics type exists already
      this._database.getAnalyticType(analytics.type).then((res: any) => {
        res = this.formatSelectArray(res);

        if (res.length > 0) {
          // type exists, add +1 to count then update
          analytics.count = res[0].count + 1;
          this._database.updateAnalyticType(analytics).then((res) => {
            resolve(res);
          }).catch((err) => {
            reject(err);
          })
        }
        else {
          // type does not exists, add new
          this._database.insertAnalytics(analytics).then((res) => {
            resolve(res);
          }).catch((err) => {
            reject(err);
          })
        }
      }).catch((err) => {
        reject(err);
      })
    })
  }

  ////////// External //////////

  /**
   * Get all places nearby a lat lng point
   *
   * @param {any} place - An object that contains 'lat' and 'lng' attributes
   */
  getNearbyAreas(place: any) {
    return new Promise((resolve, reject) => {
      this._data.getNearbyAreas(place).then((res: any) => {
        res = this.formatSelectArray(res);
        res = res.results;
        resolve(res);
      }).catch((err) => {
        console.error(err);
        reject(err);
      })
    });
  }

  /**
   * Get the releated address from a lat lng point
   *
   * @param {any} point - An object that contains 'lat' and 'lng' attributes
   */
  getGeocodingFromCoords(point: any) {
    return new Promise((resolve, reject) => {
      this._data.getGeocoding(point.lat, point.lng).then((res: any) => {
        res = this.formatSelectArray(res);
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /**
   * Get a static map centered on a lat lng point
   * Can also include markers
   *
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {any?} markers - An optional array of lat lng objects
   */
  getStaticMap(lat: number, lng: number, markers?: any) {
    return new Promise((resolve, reject) => {
      let markerText = '';
      if (UtilitiesService.doesExist(markers)) {
        // markers exist, generate Google Maps GET-style marker data
        for (let i = 0; i < markers.length; i++) {
          markerText += '&markers=color:blue%7Clabel:' + (i + 1).toString()
            + '%7C' + lat.toString() + ',' + lng.toString();
        }
      }

      this._data.getStaticMap(lat, lng, markerText).then((res: any) => {
        if (UtilitiesService.doesExist(res) && res !== false) {
          // Google Maps result must first be converted into a blob before it can be used
          let image: any;
          let reader = new FileReader();

          reader.addEventListener('load', () => {
            // image converted, send blob
            image = reader.result;
            resolve(image);
          })
          reader.readAsDataURL(res);
        }
        else {
          reject(false);
        }
      }).catch((err) => {
        reject(err);
      })
    })
  }

  ////////// Helper Functions //////////

  /**
   * PRIVATE FUNCTION
   * Common formatting that needs to be done to SQL results
   *
   * @param {any} res - SQL return value
   */
  private formatSelectArray(res: any) {
    if (res === false) {
      res = [];
    }
    else if (UtilitiesService.doesExist(res.rows)) {
      if (res.rows.length == 0) {
        res = [];
      }
      else {
        res = res.rows;
        let resRef = UtilitiesService.deepCopy(res);
        res = Object.keys(resRef).map((key) => {
          return resRef[key];
        });
      }
    }

    return res;
  }
}
