import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { UtilitiesService } from './../../_helpers/utilities.service';
import { ApiService } from './../../_services/api.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor(private _api: ApiService) { }

  locationChart = [];
  distanceChart = [];
  locationInfo = [];
  distanceInfo = [];
  locationLabels = [];
  distanceLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  locationChartDisplay = true;
  distanceChartDisplay = true;

  ngOnInit() {
    this._api.getAllAnalytics().then((locationData) => {
      // type, count
      const objectLength = Object.keys(locationData).length;
      if(objectLength > 0) {
          for(let i = 0; i < objectLength; i++) {
            this.locationInfo.push(locationData[i].count);
            this.locationLabels.push(locationData[i].type);    
            if(objectLength == this.locationInfo.length) {
              this.generateLocationChart();
            }          
          }
      } else {
          this.locationChartDisplay = false;
      }

    });
    this._api.getTestData().then((distanceData) => {
      const objectLength = Object.keys(distanceData).length;

      if (objectLength > 0) {
        let dist = 0;
        for (let i = 0; i < objectLength; i++) {
          if (i < objectLength - 1) {
            if (distanceData[i].day === distanceData[i + 1].day) {
              var start = { latitude: distanceData[i].lat, longitude: distanceData[i].lng };
              var end = { latitude: distanceData[i + 1].lat, longitude: distanceData[i + 1].lng };
              dist += UtilitiesService.distance(start, end);

            } else {
              this.distanceInfo.push(dist * 0.001);
              dist = 0;
            }
          } else {
            this.generateDistanceChart();
          }
        }
      } else {
        this.distanceChartDisplay = false;
      }
    });
  }

  generateDistanceChart() {
    this.locationChart = new Chart('distanceCanvas', {
      type: 'line',
      data: {
        labels: this.distanceLabels,
        datasets: [
          {
            data: this.distanceInfo,
            borderColor: "#ffcc00",
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel:{
              display: true,
							labelString: 'Weeks'
            },
            display: true
          }],
          yAxes: [{
            scaleLabel:{
              display: true,
							labelString: 'Distance(km)'
            },
            display: true
          }],
        }
      }
    });
  }

  generateLocationChart() {
    this.locationChart = new Chart('locationCanvas', {
      type: 'bar',
      data: {
        labels: this.locationLabels,
        datasets: [
          {
            data: this.locationInfo,
            backgroundColor: "#ffcc00"
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel:{
              display: true,
							labelString: 'Locations'
            },
            display: true
          }],
          yAxes: [{
            scaleLabel:{
              display: true,
							labelString: 'Location Visits'
            },
            display: true
          }],
        }
      }
    });
  }

}
