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

function saveFile(name, ext) {
  // TODO: Check file extension
  let data = [];
  for (let row of vm.grid()) {
    let slotsArray = [];
    for (let slot of row.slots()) {
      slotsArray.push(slot.value());
    }
    data.push(slotsArray);
  }

  let content = Papa.unparse(data);

  let blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, name + ext);
}

function saveFileFromModal() {
  let name = document.querySelector('#saveAs-body input').value;
  let ext = document.querySelector('#saveAs-body select').value;

  if (!name) {
    document.querySelector('#saveAs-body input').classList.add('border', 'border-danger');
  } else {
    saveFile(name, ext);
    document.querySelector('#saveAs-body input').classList.add('border', 'border-success');
  }
}