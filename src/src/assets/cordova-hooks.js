function onDeviceReady() {
  backgroundGeolocationInit();
}

function onDeviceResume() {
  document.getElementById('load-new-geo').click();
}

document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener('resume', onDeviceResume, false);
