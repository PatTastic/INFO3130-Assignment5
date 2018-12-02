import { Component } from '@angular/core';

import { DatabaseService } from './_data/database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private _db: DatabaseService) {
    
  }

  loadNewGeo() {
    let geo = localStorage.getItem('new-points');
    console.log('geo', geo);
  }
}
