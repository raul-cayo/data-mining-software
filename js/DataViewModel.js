/* MODEL DEFINITION */

function Slot(value) {
  var self = this;
  self.value = ko.observable(value);
  self.regex = ko.observable('\\w{2}');

  self.regexStatus = ko.pureComputed(function(){
    return self.value().match(new RegExp(self.regex())) ? '' : 'border-danger';
  }, self);
}

function Row(slots) {
  var self = this;
  self.slots = ko.observableArray(slots);
}

function DataViewModel() {
  var self = this;
  self.grid = ko.observableArray([]);
  self.attrRegex = ko.observableArray([]);
  self.fileName = ko.observable("");
  self.fileExt = ko.observable("");

  self.updateData = function(data) {
    self.grid.splice(0);
    for (let row of data) {
      let slotsArray = [];
      for (let value of row) {
        slotsArray.push(new Slot(value));
        self.attrRegex.push(new Slot('\\w{2}'));
      }
      self.grid.push(new Row(slotsArray));
    }
  }

  self.updateRegex = function(index) {
    for (let row of self.grid()) {
      let newRegex = self.attrRegex()[index].value();
      row.slots()[index].regex(newRegex);
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
    self.attrRegex.splice(index, 1);
    document.querySelector(".modal-backdrop.show").remove();
  }
}

let vm = new DataViewModel();
ko.applyBindings(vm);
