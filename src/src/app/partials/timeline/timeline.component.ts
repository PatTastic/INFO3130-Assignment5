import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

import { ConfigService } from '../../_helpers/config.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  options: any;

  constructor() {
    this.options = ConfigService.getDefaultMapOptions();
    this.options.loaded = true;
  }

  ngOnInit() {
  }

}
