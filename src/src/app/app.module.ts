import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatNativeDateModule, MatDatepickerModule } from '@angular/material';
import { RouterModule, Routes, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { faCar, faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
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
    MatDatepickerModule,
    HttpClientModule
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
    // make font awesome icons available
    library.add(faCalendarAlt);
    library.add(faCar);
    library.add(faChevronLeft);
    library.add(faTimes);
    library.add(faTwitter);
  }
}
