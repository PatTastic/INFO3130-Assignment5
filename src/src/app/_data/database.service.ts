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

  private getTestData() {
    return this._http.get('assets/data/points.json').toPromise();
  }

  getActiveDays() {
    return new Promise((resolve, reject) => {
      try {
        this.db.transaction((sqlTransactionSync) => {
          let res: any = sqlTransactionSync.executeSql('SELECT DISTINCT day FROM geoPoint', []);

          if (!UtilitiesService.doesExist(res)) {
            res = [];
          }

          for (let i = 0; i < res.length; i++) {
            res[i] = UtilitiesService.convertDateToUniformDate(res[i]);
          }
          res.push(UtilitiesService.convertDateToUniformDate(new Date().toString()));

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
        let res: any = [];

        if (date == '03-12-2018') {
          res = this.getTestData();
          resolve(res);
        }
        else {
          this.db.transaction((sqlTransactionSync) => {
            res = sqlTransactionSync.executeSql('SELECT * FROM geoPoint WHERE day = ?', [date]);

            if (!UtilitiesService.doesExist(res)) {
              res = [];
            }

            resolve(res);
          })
        }
      }
      catch (err) {
        reject(false);
      }
    })
  }
}
