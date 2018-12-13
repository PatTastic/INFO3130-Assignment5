import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  activeLink: string;

  constructor( private _router: Router) {
    this.activeLink = window.location.pathname;

    // update active tab
    this._router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        let activeLink = '';

        if (event.url.indexOf('timeline') > -1 || event.url.indexOf('tracking') > -1) {
          activeLink = 'timeline';
        }
        else if (event.url.indexOf('explore') > -1 || event.url.indexOf('suggestions') > -1 || event.url.indexOf('view-suggestion') > -1) {
          activeLink = 'explore';
        }
        else if (event.url.indexOf('stats') > -1) {
          activeLink = 'stats';
        }
        else {
          console.error('Navigation Error', 'Could not navigate to ' + event.url);
          activeLink = 'timeline';
        }

        this.activeLink = activeLink;
      }
    });
  }
}
