/*
  index.js
*/

$(document).ready(function() {

  // Assume root data source endpoint is local unless explicitly overridden.
  // This makes local front-end dev/test a bit easier from my laptop.
  //
  window.dataSourceUrl = location.origin;
  if($.urlParam('dataSourceUrl')) {
    window.dataSourceUrl = $.urlParam('dataSourceUrl');
  }

  initGauges();
  initHistory();

  // Initiate websocket connection for sensor and location updates
  //
  (function websocketConnect() {
    var host = window.dataSourceUrl.replace(/^http/, 'ws');
    //console.log('Websocket host:', host);
    var ws = new WebSocket(host);
    ws.onmessage = function(event) {
      var eventData = JSON.parse(event.data);

      switch(eventData.id) {
        case 1:
          //console.log('Received new sensor data:', eventData.data);
          $.sensorData = eventData.data;
          drawGauges(eventData.data);
          updateMap();
          $('#node-version').text(eventData.data.app.engine);
          $('#raw-data-json').text(JSON.stringify(eventData.data, null, 2));
          break;

        case 2:
          //console.log('Received new location data:', eventData.data);
          $('#raw-location-json').text(JSON.stringify(eventData.data, null, 2));
        break;
      }
    };
  })();

});

$.urlParam = function(name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  return results === null ? null : decodeURI(results[1]) || null;
};
