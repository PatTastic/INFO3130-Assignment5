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
  distanceLabels = [];
  locationChartDisplay = true;
  distanceChartDisplay = true;

  ngOnInit() {
    this._api.getAllAnalytics().then((locationData) => {
      // type, count
      const objectLength = Object.keys(locationData).length;
      if(objectLength > 0) {
        for (let i = 0; i < objectLength; i++) {
          locationData[i].type = (UtilitiesService.toTitleCase(locationData[i].type));
          this.locationInfo.push(locationData[i].count);
          this.locationLabels.push(locationData[i].type);    
          if(objectLength == this.locationInfo.length) {
            this.generateLocationChart();
          }          
        }
      }
      else {
        this.locationChartDisplay = false;
      }
    });

    this._api.getActiveDays().then((res: any) => {
      if (res !== false) {
        let length = (res.length < 5 ? res.length : 5);
        for (let i = 0; i < length; i++) {
          this.distanceLabels.push(res[i]);

          this._api.getDay(res[i]).then((days: any) => {
            if (days.length > 1) {
              for (let j = 0; j < (days.length - 1); j++) {
                let distance = UtilitiesService.distance(days[j], days[j + 1]);
                this.distanceInfo.push(distance);
              }
            }

            if (i == (length - 1)) {
              this.generateDistanceChart(length);
            }
          })
        }
      }
    })
  }

  generateDistanceChart(length: number) {
    this.locationChart = new Chart('distanceCanvas', {
      type: 'line',
      data: {
        labels: this.distanceLabels,
        datasets: [
          {
            data: this.distanceInfo,
            borderColor: "#BB9046",
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
              labelString: 'Last ' + length.toString() + ' Active Days'
            },
            display: true
          }],
          yAxes: [{
            scaleLabel:{
              display: true,
							labelString: 'Distance (m)'
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
            backgroundColor: "#BB9046"
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
							labelString: 'Location Types'
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
