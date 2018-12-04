import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as moment from 'moment';

import { ConfigService } from '../../_helpers/config.service';
import { DatabaseService } from '../../_data/database.service';
import { UtilitiesService } from '../../_helpers/utilities.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  private activeDays: string[];

  options: any;
  selectedDay: any;
  showCalendar: boolean;

  constructor(private _db: DatabaseService) {
    this.showCalendar = false;
    this.options = ConfigService.getDefaultMapOptions();
    this.options.loaded = true;

    this.selectedDay = {
      date: moment(new Date()).format('MMMM Do, YYYY'),
      dateMsg: ''
    };
  }

  ngOnInit() {
    this._db.getActiveDays().then((res) => {
      this.activeDays = UtilitiesService.deepCopy(res);
    })
  }
  
  onCalendarSelectedChange(date: string) {
    this.selectedDay.date = moment(new Date(date)).format('MMMM Do, YYYY');
    let formattedDate = UtilitiesService.convertDateToUniformDate(date);
    let isActiveDay = false;

    for (let i = 0; i < this.activeDays.length; i++) {
      if (this.activeDays[i] == formattedDate) {
        isActiveDay = true;
        break;
      }
    }

    if (isActiveDay) {
      this.selectedDay.dateMsg = '';
      this.toggleCalendar({ target: { nodeName: 'svg' } });
      //this.loadDay(formattedDate);
    }
    else {
      this.selectedDay.dateMsg = 'No data for selected date';
      setTimeout(() => {
        this.selectedDay.dateMsg = '';
      }, 3000)
    }
  }

  toggleCalendar(event: any) {
    let toggle = false;

    if (event.target.nodeName == 'path' || event.target.nodeName == 'svg') {
      toggle = true;
    }
    else if (event.target.className == 'calendar-container' || event.target.className.indexOf('calendar-icon') > -1) {
      toggle = true;
    }

    if (toggle) {
        this.showCalendar = !this.showCalendar;
      }
    }
}
