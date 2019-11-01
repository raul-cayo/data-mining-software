
function readFile() {
  var fileToLoad = document.getElementById("fileToLoad").files[0];
  var fileReader = new FileReader();

  fileReader.onload = function (event) {
    var textFromFileLoaded = event.target.result;
    data = Papa.parse(textFromFileLoaded).data;
    
    ko.applyBindings(new GridViewModel());

    var firstRow = document.querySelector('table tr:first-child');
    firstRow.style.borderWidth = "2px";
    firstRow.classList.add("bg-secondary");
  };

  fileReader.readAsText(fileToLoad, "UTF-8");
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
