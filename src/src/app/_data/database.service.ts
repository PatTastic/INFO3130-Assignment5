import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UtilitiesService } from '../_helpers/utilities.service';

@Injectable()
export class DatabaseService {
  db: any;
  
  constructor(private _http: HttpClient) {
    this.db = window['openDatabase']('info3130A5', '1.0', 'INFO3130 - A5', 2 * 1024 * 1024);
    this.createDatabase();
  }

  /**
   * PRIVATE FUNCTION
   * Generate the database tables
   */
  private createDatabase() {
    this.db.transaction((sqlTransactionSync) => {
      sqlTransactionSync.executeSql(
        'CREATE TABLE IF NOT EXISTS geoPoint(' +
        'id INTEGER PRIMARY KEY UNIQUE, ' +
        'lat REAL NOT NULL, ' +
        'lng REAL NOT NULL, ' +
        'address TEXT, ' +
        'ts INTEGER NOT NULL, ' +
        'day TEXT NOT NULL, ' +
        'weight INTEGER NOT NULL)',
        []
      );

      sqlTransactionSync.executeSql(
        'CREATE TABLE IF NOT EXISTS analytics(' +
        'id INTEGER PRIMARY KEY UNIQUE, ' +
        'type TEXT NOT NULL, ' +
        'averageCost REAL, ' +
        'averageRating REAL, ' +
        'numberOfCosts INTEGER, ' +
        'numberOfRatings INTEGER, ' +
        'count INTEGER)',
        []
      );
    }, (msg) => {
      console.log('SQL: createDatabase', msg);
    });
  }

  /**
   * Load test/demo data from json file
   */
  getTestData() {
    // generate: https://address.patwilken.me/
    // format: https://jsfiddle.net/PatTastic/75w81ax2/embedded/result
    // change date: https://text.patwilken.me/
    // beautify: https://codebeautify.org/jsonviewer

    return this._http.get('assets/data/points.json').toPromise();
  }

  ////////// geoPoint //////////

  /**
   * Get all days where data exists
   */
  getActiveDays() {
    return new Promise((resolve, reject) => {
      try {
        this.db.transaction((sqlTransactionSync) => {
          sqlTransactionSync.executeSql('SELECT DISTINCT day FROM geoPoint', [], (sync, res) => {
            if (UtilitiesService.doesExist(res)) {
              resolve(res);
            }
            else {
              reject(false);
            }
          });
        }, (msg) => {
          console.log('SQL: getActiveDays', msg);
        });
      }
      catch (err) {
        reject(false);
      }
    })
  }

  /**
   * Get activity for a specific day
   *
   * @param {string} date - Day to get data for
   */
  getDay(date: string) {
    return new Promise((resolve, reject) => {
      try {
        this.db.transaction((sqlTransactionSync) => {
          sqlTransactionSync.executeSql('SELECT * FROM geoPoint WHERE day = ?', [date], (sync, res) => {
            if (UtilitiesService.doesExist(res)) {
              resolve(res);
            }
            else {
              reject(false);
            }
          });
        }, (msg) => {
          console.log('SQL: getDay', msg);
        })
      }
      catch (err) {
        reject(false);
      }
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
      try {
        this.db.transaction((sqlTransactionSync) => {
          sqlTransactionSync.executeSql('SELECT * FROM geoPoint WHERE ts >= ? AND ts <= ?', [from, to], (sync, res) => {
              if (UtilitiesService.doesExist(res)) {
                resolve(res);
              }
              else {
                reject(false);
              }
            }
          );
        }, (msg) => {
          console.log('SQL: getDaysInRange', msg);
        })
      }
      catch (err) {
        reject(err);
      }
    })
  }

  /**
   * Save a geo point
   *
   * @param {any} point - A geopoint
   */
  saveGeoPoint(point: any) {
    return new Promise((resolve, reject) => {
      try {
        this.db.transaction((sqlTransactionSync) => {
          sqlTransactionSync.executeSql(
            'INSERT INTO geoPoint(lat, lng, address, ts, day, weight) VALUES (?, ?, ?, ?, ?, ?)',
            [point.lat, point.lng, point.address, point.ts, point.day, point.weight]
          );

          resolve(true);
        }, (msg) => {
          console.log('SQL: saveGeoPoint', msg);
        })
      }
      catch (err) {
        reject(false);
      }
    })
  }

  /**
   * Update the weight of a previously-added geopoint
   *
   * @param {any} point - A geopoint with updated weight
   */
  updateGeoPointWeight(point: any) {
    return new Promise((resolve, reject) => {
      try {
        this.db.transaction((sqlTransactionSync) => {
          sqlTransactionSync.executeSql(
            'UPDATE geoPoint SET weight = ? WHERE id = ?',
            [point.weight, point.id]
          );

          resolve(true);
        }, (msg) => {
          console.log('SQL: updateGeoPointWeight', msg);
        })
      }
      catch (err) {
        reject(false);
      }
    })
  }

  /**
   * Update the address of a previously-added geopoint
   *
   * @param {any} point - A geopoint with updated address
   */
  updateGeoPointAddress(point: any) {
    return new Promise((resolve, reject) => {
      try {
        this.db.transaction((sqlTransactionSync) => {
          sqlTransactionSync.executeSql(
            'UPDATE geoPoint SET address = ? WHERE id = ?',
            [point.address, point.id]
          );
        }, (msg) => {
          console.log('SQL: updateGeoPointAddress', msg);
        })

        resolve(true);
      }
      catch (err) {
        reject(false);
      }
    })
  }

  ////////// analytics //////////

  /**
   * Get all analytics
   */
  getAllAnalytics() {
    return new Promise((resolve, reject) => {
      try {
        this.db.transaction((sqlTransactionSync) => {
          sqlTransactionSync.executeSql('SELECT * FROM analytics', [], (sync, res) => {
            if (UtilitiesService.doesExist(res)) {
              resolve(res);
            }
            else {
              reject(false);
            }
          })
        }, (msg) => {
          console.log('SQL: getAllAnalytics', msg);
        })
      }
      catch (err) {
        reject(err);
      }
    })
  }

  /**
   * Get analytics for a specific location type
   *
   * @param {string} type - Location type
   */
  getAnalyticType(type: string) {
    return new Promise((resolve, reject) => {
      try {
        this.db.transaction((sqlTransactionSync) => {
          sqlTransactionSync.executeSql('SELECT * FROM analytics WHERE type = ?', [type], (sync, res) => {
            if (UtilitiesService.doesExist(res)) {
              resolve(res);
            }
            else {
              reject(false);
            }
          });
        }, (msg) => {
          console.log('SQL: getAnalyticType', msg);
        })
      }
      catch (err) {
        reject(err);
      }
    })
  }

  /**
   * Save new analytics row
   *
   * @param {any} analytics - New analytics object
   */
  insertAnalytics(analytics: any) {
    return new Promise((resolve, reject) => {
      try {
        this.db.transaction((sqlTransactionSync) => {
          sqlTransactionSync.executeSql(
            'INSERT INTO analytics(type, averageCost, averageRating, numberOfCosts, numberOfRatings, count) VALUES' +
            '(?, ?, ?, ?, ?, ?)',
            [analytics.type, analytics.averageCost, analytics.averageRating,
            analytics.numberOfCosts, analytics.numberOfRatings, 1]
          );

          resolve(true);
        }, (msg) => {
          console.log('SQL: insertAnalytics', msg);
        })
      }
      catch (err) {
        reject(err);
      }
    })
  }

  /**
   * Update a field for a previously-added analytics type
   *
   * @param {any} analytics - Updated analytics object
   */
  updateAnalyticType(analytics: any) {
    return new Promise((resolve, reject) => {
      try {
        this.db.transaction((sqlTransactionSync) => {
          sqlTransactionSync.executeSql(
            'UPDATE analytics SET averageCost = ?, averageRating = ?, numberOfCosts = ?, ' +
            'numberOfRatings = ?, count = ? WHERE type = ?',
            [analytics.averageCost, analytics.averageRating, analytics.numberOfCosts,
            analytics.numberOfRatings, analytics.count, analytics.type]
          );

          resolve(true);
        }, (msg) => {
          console.log('SQL: updateAnalyticType', msg);
        })
      }
      catch (err) {
        reject(err);
      }
    })
  }
}
