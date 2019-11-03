let fileName = "";
let fileExt = "";
let vm, data;

function readFile() {
  let fileToLoad = document.getElementById("fileToLoad").files[0];
  let fileReader = new FileReader();
  let fileArr = fileToLoad.name.split(".");
  fileName = fileArr[0];
  fileExt = "." + fileArr[1];

  fileReader.onload = function (event) {
    let textFromFileLoaded = event.target.result;
    data = Papa.parse(textFromFileLoaded).data;

    document.querySelector("#btn-save").removeAttribute("disabled");
    document.querySelector("#btn-saveAs").removeAttribute("disabled");
    document.querySelector("td input").removeAttribute("disabled");
    
    ko.applyBindings(vm = new GridViewModel());

    let firstRow = document.querySelector('table tr:first-child');
    firstRow.style.borderWidth = "2px";
    firstRow.classList.add("bg-secondary");
  };

  fileReader.readAsText(fileToLoad, "UTF-8");
}

function saveFile(name, ext) {
  // TODO: Check file extension
  data = [];
  for (let row of vm.rows()) {
    let slotsArray = [];
    for (let slot of row.slots()) {
      slotsArray.push(slot.value());
    }
    data.push(slotsArray);
  }

  let content = Papa.unparse(data);
  let blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  saveAs(blob, name + ext);
}

function saveFileFromModal() {
  let name = document.querySelector('.modal-body input').value;
  let ext = document.querySelector('.modal-body select').value;

  if (!name) {
    document.querySelector('.modal-body input').classList.add("border", "border-danger");
  } else {
    saveFile(name, ext);
  }
}

/* MODEL DEFINITION */
function Slot(value) {
  var self = this;
  self.value = ko.observable(value);
}

function Row(slots) {
  var self = this;
  self.slots = ko.observableArray(slots);
}

function GridViewModel() {
  var self = this;
  var rowsArray = [];

  for (let row of data) {
    let slotsArray = [];
    for (let value of row) {
      slotsArray.push(new Slot(value));
    }
    rowsArray.push(new Row(slotsArray));
  }

  self.rows = ko.observableArray(rowsArray);
}
