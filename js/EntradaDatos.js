function readFile() {
  let fileToLoad = document.getElementById('fileToLoad').files[0];
  let fileReader = new FileReader();
  let fileArr = fileToLoad.name.split('.');
  vm.fileName(fileArr[0]);
  vm.fileExt('.' + fileArr[1]);

  fileReader.onload = function (event) {
    let textFromFileLoaded = event.target.result;
    let data = Papa.parse(textFromFileLoaded).data;

    vm.loadData(data);
  };

  fileReader.readAsText(fileToLoad, 'UTF-8');
}

function saveFile(fileName, fileExt) {
  let data = [];
  for (let row of vm.grid()) {
    let slotsArray = [];
    for (let slot of row.slots()) {
      slotsArray.push(slot.value());
    }
    data.push(slotsArray);
  }

  let fileContent = '';
  if (fileExt === '.csv') {
    fileContent = Papa.unparse(data);
  }
  else {
    const gridHead = data.shift();
    fileContent += (vm.generalInfo() + '\n');
    fileContent += ('@relation ' + vm.relation() + '\n');

    for (var i = 0; i < vm.attributesInfo().length; i++) {
      fileContent += ('@attribute '
        + gridHead[i] + ' '
        + vm.attributesInfo()[i].type() + ' '
        + vm.attributesInfo()[i].regex() + '\n');
    }

    fileContent += ('@missingValue ' + vm.nullChar() + '\n\n');
    fileContent += '@data\n';
    fileContent += Papa.unparse(data);
  }

  let blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, fileName + fileExt);
}

function saveFileFromModal() {
  let fileName = document.querySelector('#saveAs-body input').value;
  let fileExt = document.querySelector('#saveAs-body select').value;

  if (!fileName) {
    document.querySelector('#saveAs-body input').classList.add('border', 'border-danger');
  } else {
    saveFile(fileName, fileExt);
    document.querySelector('#saveAs-body input').classList.add('border', 'border-success');
  }
}