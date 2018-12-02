function backgroundGeolocationInit() {

  /**
  * Geolocation is recorded in the background.
  */
  var callback = function (location) {
    console.log('location', location);

    var currentPoints = localStorage.getItem('new-points');
    if (typeof currentPoints == 'undefined' || currentPoints == null) {
      currentPoints = [];
    }
    else {
      currentPoints = JSON.parse(currentPoints);
    }

    currentPoints.push(location);
    localStorage.setItem('new-points', JSON.stringify(currentPoints));

    backgroundGeolocation.finish();
  };

  var failure = function (error) {
    console.error('BackgroundGeolocation error', error);
  };
  
  backgroundGeolocation.configure(callback, failure, {
    desiredAccuracy: 10,
    stationaryRadius: 20,
    distanceFilter: 30,
    interval: 60000
  });
  
  backgroundGeolocation.start();
  // backgroundGeolocation.stop();
}
