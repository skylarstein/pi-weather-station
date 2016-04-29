$(document).ready(function() {
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
});

function padZeros(n, len) {
 return (Array(len + 1).join("0") + n).slice(-len);
}

function humanizeSeconds(seconds) {
  var data = moment.duration(seconds, 'seconds')._data;
  return data.years + ' Years, ' + 
         data.months + ' Months, ' + 
         data.days + ' Days, ' + 
         padZeros(data.hours, 2) + ':' + padZeros(data.minutes, 2) + ':' + padZeros(data.seconds, 2);
}
