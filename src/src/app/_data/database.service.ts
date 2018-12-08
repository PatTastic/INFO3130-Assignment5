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
        'averageRating REAL)',
        []
      );
    }, (msg) => {
      console.log('SQL: createDatabase', msg);
    });
  }

  getTestData() {
    return this._http.get('assets/data/points.json').toPromise();
  }

  getActiveDays() {
    return new Promise((resolve, reject) => {
      try {
        this.db.transaction((sqlTransactionSync) => {
          let res: any = sqlTransactionSync.executeSql('SELECT DISTINCT day FROM geoPoint', []);
          resolve(res);
        }, (msg) => {
          console.log('SQL: getActiveDays', msg);
        });
      }
      catch (err) {
        reject(false);
      }
    })
  }

  getDay(date: string) {
    return new Promise((resolve, reject) => {
      try {
        this.db.transaction((sqlTransactionSync) => {
          let res: any = sqlTransactionSync.executeSql('SELECT * FROM geoPoint WHERE day = ?', [date]);
          resolve(res);
        })
      }
      catch (err) {
        reject(false);
      }
    })
  }

  saveGeoPoint(point: any) {
    return new Promise((resolve, reject) => {
      try {
        this.db.transaction((sqlTransactionSync) => {
          sqlTransactionSync.executeSql(
            'INSERT INTO geoPoint(lat, lng, address, ts, day, weight) VALUES (?, ?, ?, ?, ?, ?)',
            [point.lat, point.lng, point.address, point.ts, point.day, point.weight]
          );

          resolve(true);
        })
      }
      catch (err) {
        reject(false);
      }
    })
  }

  updateGeoPointWeight(point: any) {
    return new Promise((resolve, reject) => {
      try {
        this.db.transaction((sqlTransactionSync) => {
          sqlTransactionSync.executeSql(
            'UPDATE geoPoint SET weight = ? WHERE id = ?',
            [point.weight, point.id]
          );

          resolve(true);
        })
      }
      catch (err) {
        reject(false);
      }
    })
  }

  updateGeoPointAddress(point: any) {
    return new Promise((resolve, reject) => {
      try {
        this.db.transaction((sqlTransactionSync) => {
          sqlTransactionSync.executeSql(
            'UPDATE geoPoint SET address = ? WHERE id = ?',
            [point.address, point.id]
          );
        })

        resolve(true);
      }
      catch (err) {
        reject(false);
      }
    })
  }
}
