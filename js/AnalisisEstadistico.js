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

      Plotly.newPlot('uni-boxplot', [dataConfig], layout);

      // Calculate median mode and mean
      data.sort();

      let sum = 0;
      let firstMid = parseInt(data[Math.floor(data.length / 2)]);
      let secondMid = parseInt(data[data.length / 2 - 1]);
      for (let value of data) {
        sum += parseInt(value);
      }
      vm.uniAvg((sum / data.length).toFixed(2));
      vm.uniMed(data.length % 2 === 0 ? (firstMid + secondMid) / 2 : firstMid);
      vm.uniMode(getModes(data).join(', '));
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
        
        Plotly.newPlot('bi-scatterplot', data, layout);

        // Calculate pearson
        let xSum = 0;
        let ySum = 0;
        for (let i = 0; i < xValues.length; i++) {
          xSum += parseInt(xValues[i]);
          ySum += parseInt(yValues[i]);
        }
        let xAvg = xSum / xValues.length;
        let yAvg = ySum / yValues.length;

        let xMinusAvg2Sum = 0;
        let yMinusAvg2Sum = 0;
        let xMinusAvgyMinusAvgSum = 0;
        for (let i = 0; i < xValues.length; i++) {
          xMinusAvg2Sum += (xValues[i] - xAvg) * (xValues[i] - xAvg);
          yMinusAvg2Sum += (yValues[i] - yAvg) * (yValues[i] - yAvg);
          xMinusAvgyMinusAvgSum += (xValues[i] - xAvg) * (yValues[i] - yAvg);
        }
        let xStdDesv = Math.sqrt(xMinusAvg2Sum / xValues.length);
        let yStdDesv = Math.sqrt(yMinusAvg2Sum / yValues.length);
        
        console.log('xStdDesv: ' + xStdDesv);
        console.log('yStdDesv: ' + yStdDesv);
        console.log('xMinusAvgyMinusAvgSum: ' + xMinusAvgyMinusAvgSum);
        console.log('yStdDesv: ' + yStdDesv);

        vm.pearson((xMinusAvgyMinusAvgSum / (xValues.length * xStdDesv * yStdDesv)).toFixed(4));
      }
      else if (vm.firstBivariate().type === 'nominal' && vm.secondBivariate().type === 'nominal') {
        console.log('show chi^2');
      }
      else {
        console.log('Los tipos de datos son diferentes');
      }
    }
  }, 500);
}