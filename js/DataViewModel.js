/* MODEL DEFINITION */

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
  self.regex = ko.observable(regex);
  self.type = ko.observable('categoric');
  self.noMissingValues;
  self.percentMissing;
  self.noBadValues;
}

function Row(slots) {
  var self = this;
  self.slots = ko.observableArray(slots);
}

function DataViewModel() {
  var self = this;
  self.grid = ko.observableArray([]);
  self.attributesInfo = ko.observableArray([]);
  self.fileName = ko.observable("");
  self.fileExt = ko.observable("");
  // TODO: variables
  self.name = ko.observable("Datos");
  self.noInstances = ko.pureComputed(function(){
    return self.grid().length - 1;
  }, self);
  self.noAttributes = ko.pureComputed(function(){
    return self.attributesInfo().length;
  }, self);
  self.totalMissingValues;
  self.totalPercentMissing;


  self.loadData = function(data) {
    for (let i = 0; i < data[0].length; i++) {
      console.log(i);
      self.attributesInfo.push(new AttributeInfo('\\w{2}'));
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

  // TODO: Funtion to update atrrs info
  //self.updateAttrInfo;

  self.deleteInstance = function(index) {
    self.grid.splice(index, 1);
    document.querySelector(".modal-backdrop.show").remove();
  }

  self.deleteAttr = function(index) {
    for (let row of self.grid()) {
      row.slots.splice(index, 1);
    }
    self.attributesInfo.splice(index, 1);
    document.querySelector(".modal-backdrop.show").remove();
  }
}

let vm = new DataViewModel();
ko.applyBindings(vm);
