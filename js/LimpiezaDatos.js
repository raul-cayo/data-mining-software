function fillMissingValuesClicked(data) {
  var data = [];
  for (let i = 1; i < vm.grid().length; i++) {
    data.push( vm.grid()[i].slots()[vm.attrToClean().index].value());
  }
  
  if (vm.attrToClean().type === 'numerico') {
    data.sort();

    let sum = 0;
    let firstMid = parseInt(data[Math.floor(data.length / 2)]);
    let secondMid = parseInt(data[data.length / 2 - 1]);
    for (let value of data) {
      sum += parseInt(value);
    }
    let avg = (sum / data.length).toFixed(2);
    let med = (data.length % 2 === 0 ? (firstMid + secondMid) / 2 : firstMid);

    if(avg == med) {
      vm.criteria('Mediana');
      vm.recommendation(med);
    }
    else {
      vm.criteria('Media');
      vm.recommendation(avg);
    }
  }
  else {
    vm.criteria('Moda');
    vm.recommendation(getModes(data).join(', '));
  }
}

function fillMissingValuesFromModal() {
  let fillWith = document.querySelector('#fillMissingValues-body .fill-with').value;
  vm.fillMissingValues(fillWith);    
}

function searchAndReplaceFromModal() {
  let searchVal = document.querySelector('#searchAndReplace-body .search').value;
  let replaceVal = document.querySelector('#searchAndReplace-body .replace').value;
  vm.searchAndReplace(searchVal, replaceVal);
}