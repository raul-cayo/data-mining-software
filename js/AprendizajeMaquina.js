function executeAlgorithm() {
  let algorithm = document.querySelector('#algorithms .algorithm').value;

  if (vm.classAttr()) {
    if (algorithm == '1') { // ZeroR
      console.log('test');
      vm.zeroR();
    } 
    else if (algorithm === '2') { // OneR

    }
    else if (algorithm === '3') { // Naive Bayes
      
    }
  }
}