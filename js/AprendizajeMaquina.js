function zeroRFromModal() {
  let noInstances = document.querySelector('#zeroR-body .instances').value;
  if (vm.classAttr()) {
    vm.zeroR(parseInt(noInstances));
  }
}