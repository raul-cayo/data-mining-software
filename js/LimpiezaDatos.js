function fillMissingValuesClicked() {
  let data = [];
  for (let i = 1; i < vm.grid().length; i++) {
    data.push( vm.grid()[i].slots()[vm.attrToClean().index].value());
  }
  
  if (vm.attrToClean().type === 'numerico') {
    data.sort();

    let sum = 0;
    let firstOpt = parseInt(data[Math.floor(data.length / 2)]);
    let secondOpt = parseInt(data[Math.floor(data.length / 2) - 1]);
    for (let value of data) {
      sum += parseInt(value);
    }
    let avg = (sum / data.length).toFixed(2);
    let med = (data.length % 2 === 0 ? (firstOpt + secondOpt) / 2 : firstOpt);

    if(avg == med) {
      vm.criteria('Media');
      vm.recommendation(avg);
    }
    else {
      vm.criteria('Mediana');
      vm.recommendation(med);
    }
  }
  else {
    vm.criteria('Moda');
    vm.recommendation(getModes(data).join(', '));
  }
}

function fixTyposClicked() {
  let uniqueData = [];
  vm.typos([]);
  vm.fixes([]);

  let currentSlot;
  for (let i = 1; i < vm.grid().length; i++) {
    currentSlot = vm.grid()[i].slots()[vm.attrToClean().index];
    if(!uniqueData.includes(currentSlot.value()) && !currentSlot.status()) {
      uniqueData.push(currentSlot.value());
    } else if (currentSlot.status() === 'border border-danger' 
      && !vm.typos().includes(currentSlot.value())) {
      vm.typos.push(currentSlot.value());
    }
  }

  for(let typo of vm.typos()) {
    let min = getLevenshteinDistance(typo, uniqueData[0]);
    let fix = uniqueData[0];
    for (let data of uniqueData) {
      if(getLevenshteinDistance(typo, data) < min) {
        min = getLevenshteinDistance(typo, data);
        fix = data;
      }
    }
    vm.fixes.push(fix);
  }
}

function fixOutliersClicked() {
  let data = [];
  for (let i = 1; i < vm.grid().length; i++) {
    data.push( vm.grid()[i].slots()[vm.attrToClean().index].value() );
  }
  
  data.sort();

  // Find outliers and recommendation
  let firstOpt = parseInt(data[Math.floor(data.length / 2)]);
  let secondOpt = parseInt(data[Math.floor(data.length / 2) - 1]);
  let med = (data.length % 2 === 0 ? (firstOpt + secondOpt) / 2 : firstOpt);

  firstOpt = parseInt(data[Math.floor(data.length / 4)]);
  secondOpt = parseInt(data[Math.floor(data.length / 4) - 1]);
  let q1 = (data.length % 4 === 0 ? (firstOpt + secondOpt) / 2 : firstOpt);

  firstOpt = parseInt(data[Math.floor(data.length / 4 * 3)]);
  secondOpt = parseInt(data[Math.floor(data.length / 4 * 3) - 1]);
  let q3 = (data.length % 4 === 0 ? (firstOpt + secondOpt) / 2 : firstOpt);

  let IQR = q3 - q1;

  let sum = 0;
  vm.outliers([]);
  vm.possibleOutliers([]);
  for (let value of data) {
    sum += parseInt(value);
    if (parseInt(value) < q1 - 3*IQR || parseInt(value) > q3 + 3*IQR) {
      vm.outliers.push(parseInt(value));
    }
    else if (parseInt(value) < q1 - 1.5*IQR || parseInt(value) > q3 + 1.5*IQR) {
      vm.possibleOutliers.push(parseInt(value));
    }
  }
  let avg = (sum / data.length).toFixed(2);
  
  if(avg == med) {
    vm.criteria('Media');
    vm.recommendation(avg);
  }
  else {
    vm.criteria('Mediana');
    vm.recommendation(med);
  }
}


// Actions from Modals
function fillMissingValuesFromModal() {
  let fillWith = document.querySelector('#fillMissingValues-body .fill-with').value;
  vm.fillMissingValues(fillWith);    
}

function searchAndReplaceFromModal() {
  let searchVal = document.querySelector('#searchAndReplace-body .search').value;
  let replaceVal = document.querySelector('#searchAndReplace-body .replace').value;
  vm.searchAndReplace(searchVal, replaceVal);
}

function fixTyposFromModal() {
  vm.fixTypos();
}

function fixOutliersFromModal(all) {
  let replaceVal = document.querySelector('#fixOutliers-body .replace').value;
  vm.fixOutliers(replaceVal, all);
}

function normalizeFromModal() {
  let newMin = document.querySelector('#normalize-body .new-min').value;
  let newMax = document.querySelector('#normalize-body .new-max').value;
  if(newMin && newMax) {
    vm.normilize(parseFloat(newMin), parseFloat(newMax));
  }
}

// Util
function levenshteinDistance(s1, len1, s2, len2) {
  let cost;
  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  if (s1[len1 - 1] === s2[len2 - 1]) {
    cost = 0;
  }
  else {
    cost = 1;
  }

  return Math.min(
    levenshteinDistance(s1, len1 - 1, s2, len2) + 1,
    levenshteinDistance(s1, len1, s2, len2 - 1) + 1,
    levenshteinDistance(s1, len1 - 1, s2, len2 - 1) + cost
  )
}

function getLevenshteinDistance(s1, s2) {
  return levenshteinDistance(s1, s1.length, s2, s2.length);
}