function backgroundGeolocationInit() {

  /**
  * Geolocation is recorded in the background.
  */
  var callback = function (location) {
    /**
     Example location object

     accuracy: 2
     altitude: 55
     bearing: 1
     latitude: 43.58723168002584
     locationProvider: 0
     longitude: -80.56103579569093
     provider: "gps"
     time: 1543785842035
    */

    console.log('location', location);

    var currentPoints = localStorage.getItem('new-points');
    if (typeof currentPoints == 'undefined' || currentPoints == null) {
      currentPoints = [];
    }
    else {
      currentPoints = JSON.parse(currentPoints);
    }

    let ts = new Date();
    let day = ts.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    let month = ts.getMonth();
    if (month < 10) {
      month = '0' + month;
    }
    let formattedDay = day.toString() + month.toString() + ts.getFullYear().toString();

    currentPoints.push({
      lat: location.latitude.toFixed(6),
      lng: location.longitude.toFixed(6),
      address: '',
      ts: ts.getTime(),
      day: formattedDay,
      weight: 1
    });
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
