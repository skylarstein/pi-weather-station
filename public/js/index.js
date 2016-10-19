/*
  index.js
*/

$(document).ready(function() {

  // Assume root data source endpoint is local unless explicitly overridden.
  // This makes local front-end dev/test a bit easier from my laptop.
  //
  window.dataSourceUrl = '';
  if($.urlParam('source')) {
    window.dataSourceUrl = $.urlParam('source');
  }

  initDataDisplay();

  (function monitorLocationDetails() {
    // This request calls third part rate-limited reverse geocoding and timezone API.
    // Be nice if you want to run this app 24 hours a day.
    //
    $.get(`${window.dataSourceUrl}/location`, function(data) {
      $.locationData = data;
      $('#raw-location-json').text(JSON.stringify(data, null, 2));
      setTimeout(monitorLocationDetails, 60000);
    }).
    fail(function() {
      setTimeout(monitorLocationDetails, 60000);
    });
  })();
});

$.urlParam = function(name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  return results == null ? null : decodeURI(results[1]) || null;
}
