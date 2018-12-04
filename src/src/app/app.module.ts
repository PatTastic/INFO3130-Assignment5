import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatNativeDateModule, MatDatepickerModule } from '@angular/material';
import { RouterModule, Routes, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppComponent } from './app.component';
import { TrackingComponent } from './partials/tracking/tracking.component';
import { TimelineComponent } from './partials/timeline/timeline.component';
import { StatsComponent } from './partials/stats/stats.component';
import { SuggestionsComponent } from './partials/suggestions/suggestions.component';

import { ConfigService } from './_helpers/config.service';
import { UtilitiesService } from './_helpers/utilities.service';
import { DatabaseService } from './_data/database.service';
import { ApiService } from './_services/api.service';
import { DataService } from './_data/data.service';
import { NavComponent } from './partials/nav/nav.component';
import { ViewSuggestionComponent } from './partials/view-suggestion/view-suggestion.component';

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
    path: 'view-suggestion',
    component: ViewSuggestionComponent
  },
  {
    path: '',
    redirectTo: '/timeline',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/timeline',
  }
];

@NgModule({
  declarations: [
    AppComponent,
    TrackingComponent,
    TimelineComponent,
    StatsComponent,
    SuggestionsComponent,
    NavComponent,
    ViewSuggestionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    FontAwesomeModule,
    LeafletModule.forRoot(),
    MatNativeDateModule,
    MatDatepickerModule
  ],
  providers: [
    MatDatepickerModule,
    ConfigService,
    UtilitiesService,
    DatabaseService,
    ApiService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(faCalendarAlt);
  }
}
