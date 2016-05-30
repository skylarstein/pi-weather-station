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

  $('#ledOn').on('click', function() {
    $.post('/led-on')
      .done(function(msg) {
        alert('Success Message: ' + msg);
       })
      .fail(function(xhr, textStatus, errorThrown) {
        alert('Error: ' + xhr.status + ', ' + xhr.responseText);
      });
  });

  $('#ledOff').on('click', function() {
   $.post('/led-off')
      .done(function(msg) {
        alert('Success Message: ' + msg);
       })
      .fail(function(xhr, textStatus, errorThrown) {
        alert('Error: ' + xhr.status + ', ' + xhr.responseText);
      });
   });

  initCharts();

  (function monitorLocationDetails() {
    // This request calls third part rate-limited reverse geocoding and timezone API.
    // Be nice if you want to run this app 24 hours a day.
    //
    $.get(`${window.dataSourceUrl}/location`, function(data) {
      $.locationData = data;
      $('#raw-location-json').text(JSON.stringify(data, null, 2));
      setTimeout(monitorLocationDetails, 60000);
    });
  })();
});

$.urlParam = function(name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  return results == null ? null : decodeURI(results[1]) || null;
}
