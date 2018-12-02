import { Injectable } from '@angular/core';

@Injectable()
export class DatabaseService {
  db: any;
  
  constructor() {
    this.db = window['openDatabase']('info3130A5', '1.0', 'INFO3130 - A5', 2 * 1024 * 1024);
  }
}
