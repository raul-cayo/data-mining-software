function fillMissingValuesClicked(data) {
  if (vm.attrToClean()) {
    var data = [];
    for (let i = 1; i < vm.grid().length; i++) {
      data.push( vm.grid()[i].slots()[vm.attrToClean().index].value());
    }
    vm.attrToCleanMode(getModes(data).join(', '));
  }
}

function fillMissingValuesFromModal() {
  if (vm.attrToClean()) {
    let fillWith = document.querySelector('#fillMissingValues-body .fill-with').value;
    for (let i = 1; i < vm.grid().length; i++) {
      if (vm.grid()[i].slots()[vm.attrToClean().index].value() === vm.nullChar()) {
        vm.grid()[i].slots()[vm.attrToClean().index].value(fillWith);
      }
    }
  }
}