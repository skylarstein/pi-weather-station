/*
  data-display.js

  Montor data stuff, draw data stuff.
*/

var map;
var marker;
var firstFix = true;
var mapReady = false;

function initMap() {

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center : { lat : 37.444795, lng : -122.165146 },
    zoom : 4
  });

  // TODO: These listeners are a hack to get the map to initially display until I come
  // back to work on this. May have something to do with the fact that '#map-canvas' has
  // size (0,0) when initMap is called. Fix layout!
  //
  google.maps.event.addListenerOnce(map, 'idle', function() {
    google.maps.event.trigger(map, 'resize');
  });

  google.maps.event.addListenerOnce(map, 'projection_changed', function() {
    google.maps.event.trigger(map, 'resize');
  });

  google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
    mapReady = true;
  });
}

function initDataDisplay() {
  google.charts.load('current', {'packages':['gauge']});
  google.charts.setOnLoadCallback(drawGauges);

  (function pollSensors() {
    $.get(window.dataSourceUrl + '/sensors/live', function(data) {
      $.sensorData = data;

      $('#node-version').text(data.app.engine);
      
      drawGauges();

      if(map && google.maps && (_.get(data, 'GPS.lat') || _.get(data, 'GPS.lon'))) {

        var latlng = new google.maps.LatLng(data.GPS.lat, data.GPS.lon);

        // If this is our first good location, pan map to location. We'll do this only once
        // on first fix to allow the user to then pan/zoom as they desire.
        //
        if(mapReady && firstFix) {
          firstFix = false;
          map.setZoom(16);
          map.panTo(latlng);
        }

        // Position marker at the latest location
        //
        if(marker) {
          marker.setPosition(latlng);
        }
        else {
          marker = new google.maps.Marker({
            position : latlng,
            map : map,
            title : ''
          });
        }
      }

      $('#raw-data-json').text(JSON.stringify(data, null, 2));
      setTimeout(pollSensors, 1000);
    }).
    fail(function() {
      setTimeout(pollSensors, 1000);
    });
  })();
}

function drawGauges() {

  if(!_.has(google, 'visualization.arrayToDataTable') || !_.has(google, 'visualization.Gauge') || !$.sensorData)
    return;

  var temperatureData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Temp F ', Number(_.get($.sensorData, 'DHT22.temperature_F', 0).toFixed(0))]
  ]);

  var humidityData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Humidity %', Number(_.get($.sensorData, 'DHT22.humidity', 0).toFixed(0))]
  ]);

  var pressureData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['inHg', Number(_.get($.sensorData, 'BME280.pressure_inHg', 0).toFixed(2))]
  ]);

  var luxData = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Lux', Number(_.get($.sensorData, 'TSL2561.lux', 0).toFixed(0))]
  ]);

  var temperatureOptions = {
    min         : 0,
    max         : 120,
    yellowFrom  : 70,
    yellowTo    : 90,
    redFrom     : 90,
    redTo       : 200,
    minorTicks  : 4,
    majorTicks  : ['0', '20', '40', '60', '80', '100', '120']
  };

  var humidityOptions = {
    min         : 0,
    max         : 100,
    minorTicks  : 4,
    majorTicks  : ['0', '20', '40', '60', '80', '100']
  };

  var pressureOptions = {
    min        : 27.8,
    max        : 31.2,
    minorTicks : 4,
    majorTicks : ['Stormy', 'Rain', 'Change', 'Fair', 'Dry']
  };

  var luxOptions = {
    min        : 0,
    max        : 40000,
    minorTicks : 10,
    majorTicks : ['0','10000', '20000', '30000', '40000']
  };

  if(!$.temperatureGauge) {
    $.temperatureGauge = new google.visualization.Gauge(document.getElementById('temperature-gauge'));
  }

  if(!$.humidityGauge) {
    $.humidityGauge = new google.visualization.Gauge(document.getElementById('humidity-gauge'));
  }

  if(!$.pressureGauge) {
    $.pressureGauge = new google.visualization.Gauge(document.getElementById('pressure-gauge'));
  }

  if(!$.luxGauge) {
    $.luxGauge = new google.visualization.Gauge(document.getElementById('lux-gauge'));
  }

  $.temperatureGauge.draw(temperatureData, temperatureOptions);
  $.humidityGauge.draw(humidityData, humidityOptions);
  $.pressureGauge.draw(pressureData, pressureOptions);
  $.luxGauge.draw(luxData, luxOptions);
}
