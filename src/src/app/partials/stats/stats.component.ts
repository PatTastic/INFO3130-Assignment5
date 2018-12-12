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
  twitterShare = { distance: '', locations: '' };

  ngOnInit() {
    this._api.getAllAnalytics().then((locationData) => {
      // type, count
      const objectLength = Object.keys(locationData).length;
      if (objectLength > 0) {
        let totalVists = 0;

        // generate chart data
        for (let i = 0; i < objectLength; i++) {
          locationData[i].type = (UtilitiesService.toTitleCase(locationData[i].type));
          totalVists += locationData[i].count;
          this.locationInfo.push(locationData[i].count);
          this.locationLabels.push(locationData[i].type);    
          if(objectLength == this.locationInfo.length) {
            this.generateLocationChart();
          }          
        }

        // generate twitter link
        let s = (this.locationLabels.length == 1 ? '' : 's');
        this.twitterShare.locations = encodeURI('https://twitter.com/intent/tweet?text='
          + 'I visited ' + this.locationLabels.length.toString() + ' type' + s
          + ' of location' + s + ' a total of ' + totalVists.toString() + ' time' + s
          + '! See your own stats here: https://goo.gl/MphjgD ') + '%23heatmaptrackingapp';
      }
      else {
        this.locationChartDisplay = false;
      }
    });

    this._api.getActiveDays().then((res: any) => {
      if (res !== false) {
        let length = (res.length < 5 ? res.length : 5);
        for (let i = 0; i < length; i++) {
          // generate chart data
          this.distanceLabels.push(res[i]);

          this._api.getDay(res[i]).then((days: any) => {
            if (days.length > 1) {
              let totalDistance = 0;
              for (let j = 0; j < (days.length - 1); j++) {
                let distance = UtilitiesService.distance(days[j], days[j + 1]);
                this.distanceInfo.push(distance);
                totalDistance += distance;
              }

              // generate twitter link
              this.twitterShare.distance = encodeURI('https://twitter.com/intent/tweet?text='
                + 'I covered ' + totalDistance.toFixed(2).toString()
                + ' meters in the last 5 days! See your own stats here: https://goo.gl/MphjgD ')
                + '%23heatmaptrackingapp';
            }

            if (i == (length - 1)) {
              this.generateDistanceChart(length);
            }
          })
        }
      }
    })
  }

  /**
   * Generate the Distance chart
   *
   * @param {number} length - Number of active days being displayed
   */
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

  /**
   * Generate the Locations chart
   */
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
