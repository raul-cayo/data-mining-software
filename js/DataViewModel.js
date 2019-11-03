/* MODEL DEFINITION */

function Slot(value) {
  var self = this;
  self.value = ko.observable(value);
}

function Row(slots) {
  var self = this;
  self.slots = ko.observableArray(slots);
}

function DataViewModel() {
  var self = this;
  self.grid = ko.observableArray([]);
  self.fileName = ko.observable("");
  self.fileExt = ko.observable("");

  self.updateData = function (data){
    self.grid.splice(0);
    for (let row of data) {
      let slotsArray = [];
      for (let value of row) {
        slotsArray.push(new Slot(value));
      }
      self.grid.push(new Row(slotsArray));
    }
  }
}

let vm = new DataViewModel();
ko.applyBindings(vm);
