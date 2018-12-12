﻿import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import * as moment from 'moment';
declare var HeatmapOverlay;

import { ConfigService } from '../../_helpers/config.service';
import { ApiService } from '../../_services/api.service';
import { UtilitiesService } from '../../_helpers/utilities.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit, OnDestroy {
  private activeDays: string[];
  private dateBackup: any;
  private liveTrackingInterval: any;
  private liveTrackingLatest: any;
  private lastUpdateTimeout: any;
  private placeMarkerInterval: any;

  map: any;
  selectedDay: any;
  showCalendar: boolean;
  dataPoints: any[];
  isLiveTracking: boolean;
  lastUpdate: any;

  heatmapLayer = new HeatmapOverlay({
    radius: 20,
    maxOpacity: 0.8,
    scaleRadius: false,
    useLocalExtrema: true,
    latField: 'lat',
    lngField: 'lng',
    valueField: 'count'
  });

  constructor(private _api: ApiService) {
    this.placeMarkerInterval = -1;
    this.lastUpdateTimeout = -1;
    this.liveTrackingLatest = null;
    this.liveTrackingInterval = -1;
    this.showCalendar = false;
    this.dataPoints = [];
    this.isLiveTracking = false;
    this.dateBackup = {};

    this.map = {
      options: ConfigService.getDefaultMapOptions(),
      center: ConfigService.getDefaultMapCenter(),
      fitBounds: null,
      zoom: ConfigService.getDefaultMapZoom()
    };
    this.map.options.layers.push(this.heatmapLayer);
    this.map.options.loaded = true;

    this.selectedDay = {
      date: moment(new Date()).subtract(1, 'days').format(ConfigService.displayDateFormat),
      dateMsg: ''
    };
    this.lastUpdate = {
      opacity: 0,
      numberOfPoints: 0,
      plural: ''
    };

    ConfigService.getUserLatLng().then((res: any) => {
      this.map.center = res;
    });
  }

  ngOnInit() {
    this._api.getActiveDays().then((res) => {
      this.activeDays = UtilitiesService.deepCopy(res);
    })
  }

  ngOnDestroy() {
    if (this.liveTrackingInterval != -1) {
      clearInterval(this.liveTrackingInterval);
      this.liveTrackingInterval = -1;
    }
    if (this.lastUpdateTimeout != -1) {
      clearTimeout(this.lastUpdateTimeout);
      this.lastUpdateTimeout = -1;
    }
    if (this.placeMarkerInterval != -1) {
      clearInterval(this.placeMarkerInterval);
      this.placeMarkerInterval = -1;
    }
  }
  
  onCalendarSelectedChange(date: string) {
    let formattedDate = UtilitiesService.convertDateToUniformDate(date);
    let isActiveDay = false;

    for (let i = 0; i < this.activeDays.length; i++) {
      if (this.activeDays[i] == formattedDate) {
        isActiveDay = true;
        break;
      }
    }

    if (isActiveDay) {
      this.selectedDay.date = moment(new Date(date)).format(ConfigService.displayDateFormat);
      this.selectedDay.dateMsg = '';
      this.toggleCalendar({ target: { nodeName: 'svg' } });
      this.loadDay(formattedDate);
    }
    else {
      this.selectedDay.dateMsg = 'No data for selected date';
      setTimeout(() => {
        this.selectedDay.dateMsg = '';
      }, 3000)
    }
  }

  onMapReady(map: L.Map) {
    //map.on('mousemove', (event: L.LeafletMouseEvent) => {
    //  this.heatmapLayer.setData([{
    //    lat: event.latlng.lat,
    //    lng: event.latlng.lng,
    //    count: 1
    //  }]);
    //});
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

  loadDay(day: string) {
    this.map.fitBounds = null;
    let today = moment(new Date()).format(ConfigService.internalDateFormat);

    if (this.placeMarkerInterval != -1) {
      clearInterval(this.placeMarkerInterval);
      this.placeMarkerInterval = -1;
    }

    if (day == today) {
      this.enterLiveTracking();
    }
    else {
      this._api.getDay(day).then((res) => {
        setTimeout(() => {
          this.dataPoints = UtilitiesService.deepCopy(res);
          let onlyHeatMapData = [];
          let currentIndex = 0;

          for (let i = 0; i < this.dataPoints.length; i++) {
            onlyHeatMapData.push({
              lat: this.dataPoints[i].lat,
              lng: this.dataPoints[i].lng,
              count: 0.1
            });
          }

          this.map.fitBounds = onlyHeatMapData;

          this.placeMarkerInterval = setInterval(() => {
            this.heatmapLayer.addData(onlyHeatMapData[currentIndex]);
            currentIndex++;

            if (currentIndex == onlyHeatMapData.length) {
              clearInterval(this.placeMarkerInterval);
              this.placeMarkerInterval = -1;
            }
          }, 100);
        }, 500);
      })
    }
  }

  enterLiveTracking() {
    this.map.fitBounds = null;
    this.isLiveTracking = true;

    if (this.placeMarkerInterval != -1) {
      clearInterval(this.placeMarkerInterval);
      this.placeMarkerInterval = -1;
    }

    let todaysData: any = localStorage.getItem('new-points');
    if (UtilitiesService.doesExist(todaysData)) {
      todaysData = JSON.parse(todaysData);
      this.liveTrackingLatest = todaysData[todaysData.length - 1];
    }
    else {
      todaysData = [];
      this.liveTrackingLatest = null;
    }

    this.heatmapLayer.setData({ data: todaysData });

    this.dateBackup = {
      selectedDay: UtilitiesService.deepCopy(this.selectedDay),
      dataPoints: UtilitiesService.deepCopy(this.dataPoints)
    };

    ConfigService.getUserLatLng().then((res: any) => {
      this.map.zoom = 18;
      this.map.center = res;
    });

    this.liveTrackingInterval = setInterval(() => { this.checkLiveTracking() }, 20000);
  }

  exitLiveTracking() {
    this.map.zoom = ConfigService.getDefaultMapZoom();
    this.map.fitBounds = null;
    this.isLiveTracking = false;

    this.selectedDay = UtilitiesService.deepCopy(this.dateBackup.selectedDay);
    this.dataPoints = UtilitiesService.deepCopy(this.dateBackup.dataPoints);

    if (this.dataPoints.length > 0) {
      this.map.fitBounds = this.dataPoints;
      this.heatmapLayer.setData({ data: this.dataPoints });
    }

    if (this.lastUpdateTimeout != -1) {
      clearTimeout(this.lastUpdateTimeout);
      this.lastUpdateTimeout = -1;
      this.lastUpdate = {
        opacity: 0,
        numberOfPoints: 0,
        plural: ''
      };
    }

    this.dateBackup = {};
    clearInterval(this.liveTrackingInterval);
    this.liveTrackingInterval = -1;
  }

  checkLiveTracking() {
    if (this.liveTrackingInterval != -1) {
      let todaysData: any = localStorage.getItem('new-points');
      let newData = [];

      if (UtilitiesService.doesExist(todaysData)) {
        todaysData = JSON.parse(todaysData);

        if (todaysData !== null && todaysData.length > 0) {
          for (let i = 0; i < todaysData.length; i++) {
            if (todaysData[i].ts == this.liveTrackingLatest.ts) {
              if (i != (todaysData.length - 1)) {
                newData = todaysData.splice(0, i);
                break;
              }
            }
          }

          this.liveTrackingLatest = UtilitiesService.deepCopy(todaysData[todaysData.length - 1]);

          if (newData.length > 0) {
            this.heatmapLayer.addData({ data: newData });
            this.map.center = {
              lat: newData[newData.length - 1].lat,
              lng: newData[newData.length - 1].lng
            };

            this.lastUpdate = {
              opacity: 1,
              numberOfPoints: newData.length,
              plural: (newData.length == 1 ? '' : 's')
            };
            setTimeout(() => {
              this.lastUpdate = {
                opacity: 0,
                numberOfPoints: 0,
                plural: ''
              };
            }, 2000);
          }
        }
      }
    }
  }
}
