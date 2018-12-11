import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class ConfigService {
  static internalDateFormat: string = 'DD-MM-YYYY';
  static displayDateFormat: string = 'MMMM Do, YYYY';

  static googleMapsKey: string = 'AIzaSyBqmy5AGFZnvnu6VtgBkEJo-pIDFuLRsLY';

  static getDefaultMapCenter() {
    return L.latLng(43.390757, -80.403047);
  }

  static getDefaultMapZoom() {
    return 16;
  }

  static getDefaultMapOptions() {
    return {
      loaded: false,
      layers: [
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 })
      ],
      zoom: this.getDefaultMapZoom(),
      center: this.getDefaultMapCenter()
    };
  }

  static getUserLatLng() {
    return new Promise((resolve, reject) => {
      let onSuccess = ((position) => {
        let loc = L.latLng(
          position.coords.latitude,
          position.coords.longitude
        );

        resolve(loc);
      });
      
      let onError = ((error) => {
        let loc = {
          lat: 43.390757,
          lng: -80.403047
        };

        reject(this.getDefaultMapCenter());
      });

      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    })
  }

  static getWhitelistedPlaceTypes() {
    return [
      'amusement_park',
      'aquarium',
      'art_gallery',
      'bakery',
      'bar',
      'beauty_salon',
      'bicycle_store',
      'book_store',
      'bowling_alley',
      'cafe',
      'campground',
      'car_dealer',
      'car_rental',
      'car_repair',
      'car_wash',
      'casino',
      'clothing_store',
      'convenience_store',
      'department_store',
      'electrician',
      'electronics_store',
      'florist',
      'furniture_store',
      'gas_station',
      'gym',
      'hair_care',
      'hardware_store',
      'home_goods_store',
      'insurance_agency',
      'jewelry_store',
      'laundry',
      'liquor_store',
      'locksmith',
      'lodging',
      'meal_delivery',
      'meal_takeaway',
      'movie_rental',
      'movie_theater',
      'moving_company',
      'museum',
      'night_club',
      'painter',
      'park',
      'pet_store',
      'pharmacy',
      'physiotherapist',
      'plumber',
      'real_estate_agency',
      'restaurant',
      'roofing_contractor',
      'rv_park',
      'shoe_store',
      'shopping_mall',
      'spa',
      'store',
      'supermarket',
      'travel_agency',
      'veterinary_care',
      'zoo'
    ];
  }
}
