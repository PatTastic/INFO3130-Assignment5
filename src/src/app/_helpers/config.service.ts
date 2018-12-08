import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class ConfigService {
  static internalDateFormat: string = 'DD-MM-YYYY';
  static displayDateFormat: string = 'MMMM Do, YYYY';

  static googleMapsKey: string = 'AIzaSyCBL6M0aBHumoG2ZDWAvkXN9iJFMJMrxaA';

  static getDefaultMapOptions() {
    return {
      loaded: false,
      layers: [
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 })
      ],
      zoom: 16,
      center: L.latLng(43.390757, -80.403047)
    };
  }
}
