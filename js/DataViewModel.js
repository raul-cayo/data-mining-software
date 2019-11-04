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
  self.regex = ko.observableArray([]);
  self.fileName = ko.observable("");
  self.fileExt = ko.observable("");

  self.updateData = function(data) {
    self.grid.splice(0);
    for (let row of data) {
      let slotsArray = [];
      for (let value of row) {
        slotsArray.push(new Slot(value));
        self.regex.push(new Slot(""));
      }
      self.grid.push(new Row(slotsArray));
    }
  }

  self.deleteInstance = function(index) {
    self.grid.splice(index, 1);
    document.querySelector(".modal-backdrop.show").remove();
  }

  self.deleteAttr = function(index) {
    for (let row of self.grid()) {
      row.slots.splice(index, 1);
    }
    document.querySelector(".modal-backdrop.show").remove();
  }
}

let vm = new DataViewModel();
ko.applyBindings(vm);
