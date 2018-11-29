import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppComponent } from './app.component';
import { TrackingComponent } from './partials/tracking/tracking.component';
import { TimelineComponent } from './partials/timeline/timeline.component';
import { StatsComponent } from './partials/stats/stats.component';
import { SuggestionsComponent } from './partials/suggestions/suggestions.component';

import { UtilitiesService } from './_helpers/utilities.service';
import { ApiService } from './_services/api.service';
import { DataService } from './_data/data.service';

const appRoutes: Routes = [
  {
    path: 'tracking',
    component: TrackingComponent
  },
  {
    path: 'timeline',
    component: TimelineComponent
  },
  {
    path: 'stats',
    component: StatsComponent
  },
  {
    path: 'suggestions',
    component: SuggestionsComponent
  },
  {
    path: '',
    redirectTo: '/stats',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/stats',
  }
];

@NgModule({
  declarations: [
    AppComponent,
    TrackingComponent,
    TimelineComponent,
    StatsComponent,
    SuggestionsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FontAwesomeModule,
    LeafletModule.forRoot()
  ],
  providers: [
    UtilitiesService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
