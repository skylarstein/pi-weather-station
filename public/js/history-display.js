/*
  history-display.js

  Draw some charts to display sensor data over time.
*/
function initHistory() {

  const endDate = new Date();
  const startDate = new Date(endDate - 1000 * 3600 * 24); // last 24 hours

  $.get(window.dataSourceUrl + '/sensors/history/' + startDate.toISOString() + '/' + endDate.toISOString(), function(data) {

    var temperature = [];
    var humidity = [];
    var pressure = [];
    var lux = [];

    data.forEach((element, idx) => {
      //if(idx % 5) return; // arbitrary thinning for some nice curve smoothing and faster rendering
      temperature.push({ x : element.timestamp, y : element.temperatureC * 9 / 5 + 32 });
      humidity.push({ x : element.timestamp, y : element.humidity });
      pressure.push({ x : element.timestamp, y : element.pressureinHg });

      if(element.lux >= 0 && element.lux <= 40000) { // TSL2561 gets blown out in direct sunlight to clean it up
        lux.push({ x : element.timestamp, y : element.lux });
      }
    });

    var chartOptions = {
      elements : {
        point : {
          radius : 0
        }
      },
      scales : {
        xAxes : [{
          type : 'time',
          unit : 'day',
          unitStepSize : 1,
          position : 'bottom',
          ticks : {
            maxRotation : 25,
            minRotation : 25,
          },
          time : {
            displayFormats : {
              day : 'MMM DD'
          }}
        }]
      },
      tooltips : {
        callbacks : {
          title : function(tooltipItems, data) {
            // UTC to local date/time
            var d = new Date(tooltipItems[0].xLabel);
            return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
          },
          label : function(tooltipItem, data) {
            // Two digits of precision will do
            return data.datasets[0].label + ': ' + Number(data.datasets[0].data[tooltipItem.index].y).toFixed(2);
          },
        }
      }
    };

    var temperatureChartData = {
      type : 'line',
      data : {
        datasets : [{
          label : 'Temperature (F)',
          backgroundColor : 'rgba(255, 136, 0, 0.60)',
          borderColor : 'rgba(0, 0, 0, 0)',
          data : temperature
        }]
      },
      options : chartOptions
    };

    var humidityChartData = {
      type : 'line',
      data : {
        datasets : [{
          label : 'Humidity',
          backgroundColor : 'rgba(77, 158, 239, 0.60)',
          borderColor : 'rgba(0, 0, 0, 0)',
          data : humidity
        }]
      },
      options : chartOptions
    };

    var pressureChartData = {
      type : 'line',
      data : {
        datasets : [{
          label : 'Pressure (inHg)',
          backgroundColor : 'rgba(0, 199, 116, 0.50)',
          borderColor : 'rgba(0, 0, 0, 0)',
          data : pressure
        }]
      },
      options : chartOptions
    };

    var luxChartData = {
      type : 'line',
      data : {
        datasets : [{
          label : 'Lux',
          backgroundColor : 'rgba(242, 230, 69, 0.60)',
          borderColor : 'rgba(0, 0, 0, 0)',
          data : lux
        }]
      },
      options : chartOptions
    };

    var temperatureChart = new Chart($('#temperatureChart'), temperatureChartData);    
    var humidityChart = new Chart($('#humidityChart'), humidityChartData);
    var pressureChart = new Chart($('#pressureChart'), pressureChartData);
    var luxChart = new Chart($('#luxChart'), luxChartData);
  }).
  fail(function(xhr, status, error) {
    console.log('Failed to retrieve sensor history! Error ' + xhr.status + ': ' + xhr.responseText);
  });
}
