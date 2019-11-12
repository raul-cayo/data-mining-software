function readFile() {
  let fileToLoad = document.getElementById('fileToLoad').files[0];
  let fileReader = new FileReader();
  let fileArr = fileToLoad.name.split('.');
  let options = {};

  options.fileName = fileArr[0];
  options.fileExt = '.' + fileArr[1];
  options.generalInfo = '';
  options.attrsInfo = [];

  fileReader.onload = function (event) {
    let textFromFileLoaded = event.target.result;
    let data;
    if (options.fileExt === '.csv') {
      data = Papa.parse(textFromFileLoaded).data;
    }
    else if (options.fileExt === '.data') {
      let textLines = textFromFileLoaded.split('\n');
      let dataText = '';
      let gettingData = false;

      for (let line of textLines) {
        if (line === '') continue;
        if (gettingData) {
          dataText += line + '\n';
        }
        else if (line.slice(0, 2) === '%%') {
          options.generalInfo += line + '\n';
        }
        else if (line.slice(0, 1) === '@') {
          if (line.slice(1, 9) === 'relation') {
            options.relation = line.slice(10);
          }
          if (line.slice(1, 10) === 'attribute') {
            let attrInfo = line.slice(11).split(' ');
            dataText += attrInfo[0] + ',';
            options.attrsInfo.push({
              type: attrInfo[1],
              regex: attrInfo[2]
            });
          }
          if (line.slice(1, 13) === 'missingValue') {
            options.nullChar = line.slice(14);
          }
          if (line.slice(1, 5) === 'data') {
            dataText = dataText.slice(0, -1) + '\n';
            gettingData = true;
          }
        }
      }
      data = Papa.parse(dataText.slice(0, -1)).data;
    }

    vm.loadData(data, options);
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
    fileContent = Papa.unparse(data, {newline: '\n'});
  }
  else if (fileExt === '.data') {
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
    fileContent += Papa.unparse(data, {newline: '\n'});
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

function addAttributeFromModal() {
  let attrName = document.querySelector('#addAttr-body .attr-name').value;
  let attrRegex = document.querySelector('#addAttr-body .attr-regex').value;
  let attrType = document.querySelector('#addAttr-body .attr-type').value;
  let attrDefaultValue = document.querySelector('#addAttr-body .attr-default').value;
  vm.addAttr(attrName, attrRegex, attrType, attrDefaultValue);
}

function addInstanceFromModal() {
  let instanceDefault = document.querySelector('#addInstance-body input').value;
  vm.addInstance(instanceDefault);
}

function showLoading () {
  $('#loading-modal').modal('show');
}

function hideLoading () {
  setTimeout(() => {
    $('#loading-modal').modal('hide');
  }, 300); 
}