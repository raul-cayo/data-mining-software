/* ***** MODEL DEFINITION ***** */

function Slot(value) {
  var self = this;
  self.value = ko.observable(value);
  self.regex = ko.observable('\\w{2}');

  self.regexStatus = ko.pureComputed(function(){
    return self.value().match(new RegExp(self.regex())) ? '' : 'border-danger';
  }, self);
}

function AttributeInfo(regex) {
  var self = this;
  self.regex = ko.observable(regex); // default value
  self.type = ko.observable('Categórico'); // default value
  self.noMissingValues = ko.observable(0);
  self.percentMissing = ko.observable(0);
  self.noBadValues = ko.observable(0);
}

function Row(slots) {
  var self = this;
  self.slots = ko.observableArray(slots);
}

function DataViewModel() {
  var self = this;
  self.grid = ko.observableArray([]);
  self.attributesInfo = ko.observableArray([]);
  self.fileName = ko.observable('');
  self.fileExt = ko.observable('');
  self.name = ko.observable('Datos');  // default value
  self.valueTypeOptions = ['Categórico', 'Numérico'];

  // *** Computed values ***
  self.noInstances = ko.pureComputed(function() {
    return self.grid().length - 1;
  }, self);

  self.noAttributes = ko.pureComputed(function() {
    return self.attributesInfo().length;
  }, self);

  self.totalMissingValues = ko.pureComputed(function() {
    let totalMissing = 0;
    for (let row of self.grid()) {
      for (let slot of row.slots()) {
        if (!slot.value()) {
          totalMissing++;
        }
      }
    }
    return totalMissing;
  }, self);

  self.totalPercentMissing = ko.pureComputed(function() {
    let percent = self.totalMissingValues() * 100 / (self.noInstances() * self.noAttributes());
    return percent.toFixed(2);
  }, self);

  // *** Functions ***
  self.loadData = function(data) {
    // TODO: read metadata from .data and add defaults
    for (let i = 0; i < data[0].length; i++) {
      self.attributesInfo.push(new AttributeInfo('\\w{2}')); // default value
    }

    self.grid.splice(0);
    for (let row of data) {
      let slotsArray = [];
      for (let value of row) {
        slotsArray.push(new Slot(value));
      }
      self.grid.push(new Row(slotsArray));
    }
  }

  self.updateRegex = function(index) {
    for (let row of self.grid()) {
      let newRegex = self.attributesInfo()[index].regex();
      row.slots()[index].regex(newRegex);
    }
  }

  self.updateAttrInfo = function(index) {
    let countMissing = 0;
    let countBad = 0;

    for (var i = 1; i < self.grid().length; i++) {
      let missingValue = self.grid()[i].slots()[index].value() === '' ? true : false;
      let badValue = self.grid()[i].slots()[index].regexStatus() === '' ? false : true;

      if (missingValue) {
        countMissing++;
      } else if (badValue) {
        countBad++;
      }
    }

    let percentMissing = countMissing * 100 / self.noInstances();

    self.attributesInfo()[index].noMissingValues(countMissing);
    self.attributesInfo()[index].percentMissing(percentMissing.toFixed(2));
    self.attributesInfo()[index].noBadValues(countBad);
  }

  self.deleteAttr = function(index) {
    for (let row of self.grid()) {
      row.slots.splice(index, 1);
    }
    self.attributesInfo.splice(index, 1);
    document.querySelector('.modal-backdrop.show').remove();
  }

  self.deleteInstance = function(index) {
    self.grid.splice(index, 1);
    document.querySelector('.modal-backdrop.show').remove();
  }
}

let vm = new DataViewModel();
ko.applyBindings(vm);
