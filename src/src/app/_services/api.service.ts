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

  ////////// Local Database //////////

  getActiveDays() {
    return new Promise((resolve, reject) => {
      this._database.getActiveDays().then((res: any) => {
        if (!UtilitiesService.doesExist(res)) {
          res = [];
        }

        for (let i = 0; i < res.length; i++) {
          res[i] = UtilitiesService.convertDateToUniformDate(res[i]);
        }
        res.push('03-12-2018');
        res.push(UtilitiesService.convertDateToUniformDate(new Date().toString()));

        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  getDay(date: string) {
    return new Promise((resolve, reject) => {
      if (date == '03-12-2018') {
        this._database.getTestData().then((res: any) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      }
      else {
        this._database.getDay(date).then((res: any) => {
          if (!UtilitiesService.doesExist(res)) {
            res = [];
          }

          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      }
    })
  }

  getDaysInRange(from: string, to: string) {
    return new Promise((resolve, reject) => {
      let fromTs = Date.parse(new Date(from).toDateString());
      let toTs = Date.parse(new Date(to).toDateString());

      this._database.getDaysInRange(from, to).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  saveGeoPoint(point: any) {
    return new Promise((resolve, reject) => {
      this._database.saveGeoPoint(point).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  updateGeoPointWeight(point: any) {
    return new Promise((resolve, reject) => {
      this._database.updateGeoPointWeight(point).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  updateGeoPointAddress(point: any) {
    return new Promise((resolve, reject) => {
      this._database.updateGeoPointAddress(point).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  addToAnalytics(analytics: any) {
    return new Promise((resolve, reject) => {
      this._database.getAnalyticType(analytics.type).then((res: any) => {
        if (UtilitiesService.doesExist(res) && res.length > 0) {
          analytics = res[0].count + 1;
          this._database.updateAnalyticType(analytics).then((res) => {
            resolve(res);
          }).catch((err) => {
            reject(err);
          })
        }
        else {
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

  getNearbyAreas(place: any) {
    return new Promise((resolve, reject) => {
      this._data.getNearbyAreas(place).then((res) => {
        console.log(res);
        resolve(res);
      }).catch((err) => {
        console.error(err);
        reject(err);
      })
    });
  }

  getGeocodingFromCoords(point: any) {
    return new Promise((resolve, reject) => {
      this._data.getGeocoding(point.lat, point.lng).then((res) => {
        console.log(res);
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }
}
