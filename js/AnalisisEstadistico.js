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
        height: containerWidth - (containerTenth * 4),
        margin: {
          r: containerTenth / 2,
          l: containerTenth,
          t: containerTenth / 2,
          b: containerTenth / 2
        }
      };
      
      var dataConfig = {
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: -1.8,
        x: data,
        type: vm.univariate().type === 'numerico' ? 'box' : 'histogram'
      };

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
        let xValues = [];
        let yValues = [];

        for (let i = 1; i < vm.grid().length; i++) {
          xValues.push( vm.grid()[i].slots()[vm.firstBivariate().index].value());
          yValues.push( vm.grid()[i].slots()[vm.secondBivariate().index].value());
        }

        var data = [{
          x: xValues,
          y: yValues,
          mode: 'markers',
          type: 'scatter',
          marker: { size: 8 }
        }];
        
        let xMin = Math.min(...xValues);
        let xMax = Math.max(...xValues);
        let yMin = Math.min(...yValues);
        let yMax = Math.max(...yValues);
        let xRangeTenth = (Math.max(...xValues) - Math.min(...xValues)) / 10;
        let yRangeTenth = (Math.max(...yValues) - Math.min(...yValues)) / 10;

        var layout = { 
          xaxis: {
            range: [ xMin - xRangeTenth, xMax + xRangeTenth ] 
          },
          yaxis: {
            range: [ yMin - yRangeTenth, yMax + yRangeTenth ]
          },
          title: ('X: '+ vm.firstBivariate().name +', Y: '+ vm.secondBivariate().name)
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