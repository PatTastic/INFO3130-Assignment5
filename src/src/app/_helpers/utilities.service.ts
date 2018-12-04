﻿import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class UtilitiesService {
  static deepCopy(elem: any) {
    return JSON.parse(JSON.stringify(elem));
  }

  static doesExist(elem: any) {
    return !(typeof elem == 'undefined' || elem == null);
  }

  static convertDateToUniformDate(date: string) {
    return moment(new Date(date)).format('DD-MM-YYYY');
  }
}
