import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class ConfigService {
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
