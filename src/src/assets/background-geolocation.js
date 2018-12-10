function addLocation(location) {
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
  let month = (ts.getMonth() + 1);
  if (month < 10) {
    month = '0' + month;
  }
  let formattedDay = day.toString() + '-' + month.toString() + '-' + ts.getFullYear().toString();

  currentPoints.push({
    lat: location.latitude.toFixed(6),
    lng: location.longitude.toFixed(6),
    address: '',
    ts: ts.getTime(),
    day: formattedDay,
    weight: 1,
    tempTime: ts.toDateString()
  });
  localStorage.setItem('new-points', JSON.stringify(currentPoints));
}

function backgroundGeolocationInit() {
  BackgroundGeolocation.configure({
    locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    stationaryRadius: 1,
    distanceFilter: 1,
    stopOnStillActivity: false,
    notificationsEnabled: false,
    notificationTitle: 'A5',
    notificationText: 'Location Tracking: Active',
    debug: false,
    interval: 10000,
    fastestInterval: 5000,
    activitiesInterval: 10000,
    url: 'http://192.168.81.15:3000/location',
    httpHeaders: {
      'X-Data': 'Accepted'
    },
    postTemplate: {
      lat: '@latitude',
      lng: '@longitude',
    }
  });

  BackgroundGeolocation.on('location', function (location) {
    addLocation(location);
  });

  BackgroundGeolocation.on('stationary', function (stationaryLocation) {
    addLocation(stationaryLocation);
  });

  BackgroundGeolocation.on('error', function (error) {
    console.log('[ERROR] BackgroundGeolocation error:', error.code, error.message);
  });

  BackgroundGeolocation.on('start', function () {
    console.log('[INFO] BackgroundGeolocation service has been started');
  });

  BackgroundGeolocation.on('stop', function () {
    console.log('[INFO] BackgroundGeolocation service has been stopped');
  });

  BackgroundGeolocation.on('authorization', function (status) {
    console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
    if (status !== BackgroundGeolocation.AUTHORIZED) {
      setTimeout(function () {
        var showSettings = confirm('App requires location tracking permission. Would you like to open app settings?');
        if (showSetting) {
          return BackgroundGeolocation.showAppSettings();
        }
      }, 1000);
    }
  });

  BackgroundGeolocation.on('background', function () {
    console.log('[INFO] App is in background');
    BackgroundGeolocation.configure({ debug: false });
  });

  BackgroundGeolocation.on('foreground', function () {
    console.log('[INFO] App is in foreground');
    BackgroundGeolocation.configure({ debug: false });
  });

  BackgroundGeolocation.on('abort_requested', function () {
    console.log('[INFO] Server responded with 285 Updates Not Required');
  });

  BackgroundGeolocation.on('http_authorization', () => {
    console.log('[INFO] App needs to authorize the http requests');
  });

  BackgroundGeolocation.checkStatus(function (status) {
    console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
    console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
    console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);
    
    if (!status.isRunning) {
      BackgroundGeolocation.start();
    }
  });
  
  // BackgroundGeolocation.start();
  
  // BackgroundGeolocation.removeAllListeners();
}
