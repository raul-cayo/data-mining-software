function univariateChange() {
  setTimeout(() => {
    if (vm.univariate()) {
      var data = [];
      for (let i = 1; i < vm.grid().length; i++) {
        data.push( vm.grid()[i].slots()[vm.univariate().index].value());
      }
     
      var containerWidth = $('#univariate').width() - 30;
      var containerTenth = Math.floor(containerWidth / 10);
      var layout = {
        autosize: false,
        width: containerWidth,
        height: containerWidth - containerTenth,
        margin: {
          r: containerTenth / 2,
          l: containerTenth,
          t: containerTenth,
        }
      };
      var dataConfig = {
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: -1.8
      };

      if (vm.univariate().type === 'numerico') {
        layout.margin.b = containerTenth / 2;
        dataConfig.type = 'box';
        dataConfig.y = data;
      }
      else {
        layout.margin.b = containerTenth;
        dataConfig.type = 'histogram';
        dataConfig.x = data;
      }

      data.sort();

      let sum = 0;
      let firstMid = parseInt(data[Math.floor(data.length / 2)]);
      let secondMid = parseInt(data[data.length / 2 - 1]);
      for (let i = 0; i < data.length; i++) {
        sum += parseInt(data[i]);
      }
      vm.uniAvg((sum / data.length).toFixed(2));
      vm.uniMed(data.length % 2 === 0 ? (firstMid + secondMid) / 2 : firstMid);
      vm.uniMode(getModes(data).join(', '));
      
      Plotly.newPlot('uni-boxplot', [dataConfig], layout);
    }
  }, 500);
}

function getModes(array) {
  var frequency = {};
  var maxFreq = 0;
  var modes = [];

  for (var i in array) {
    frequency[array[i]] = (frequency[array[i]] || 0) + 1;

    if (frequency[array[i]] > maxFreq) {
      maxFreq = frequency[array[i]];
    }
  }

  for (var k in frequency) {
    if (frequency[k] == maxFreq) {
      modes.push(k);
    }
  }

  return modes;
}

function bivariateChange() {
  setTimeout(() => {
    if (vm.firstBivariate() && vm.secondBivariate()) {
      if (vm.firstBivariate().type === 'numerico' && vm.secondBivariate().type === 'numerico') {
        
        var data = [{
          x: [1, 2, 3, 4, 5],
          y: [1, 6, 3, 6, 1],
          mode: 'markers',
          type: 'scatter',
          marker: { size: 12 }
        }];
        
        var layout = { 
          xaxis: {
            range: [ 0.75, 5.25 ] 
          },
          yaxis: {
            range: [0, 8]
          },
          title:'X: Edad, Y: Edad'
        };
        
        Plotly.newPlot('bi-scatterplot', data, layout, {showSendToCloud: true});
      }
      else if (vm.firstBivariate().type === 'nominal' && vm.secondBivariate().type === 'nominal') {
        console.log('show chi^2')
      }
      else {
        console.log('Los tipos de datos son diferentes')
      }
    }
  }, 500);
}