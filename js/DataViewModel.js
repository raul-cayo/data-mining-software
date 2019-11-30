/* ***** MODEL DEFINITION ***** */

function Slot(value, regex) {
  var self = this;
  self.value = ko.observable(value);
  self.regex = ko.observable(regex);

  self.status = ko.pureComputed(function () {
    if (self.value() === vm.nullChar()){
      return 'border border-warning';
    }
    return self.value().match(new RegExp(self.regex())) ? '' : 'border border-danger';
  }, self);
}

function AttributeInfo(regex, type) {
  var self = this;
  self.regex = ko.observable(regex);
  self.type = ko.observable(type);
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

  self.relation = ko.observable('');
  self.generalInfo = ko.observable('');
  self.nullChar = ko.observable('');

  self.univariate = ko.observable('');
  self.uniAvg = ko.observable('');
  self.uniMed = ko.observable('');
  self.uniMode = ko.observable('');

  self.firstBivariate = ko.observable('');
  self.secondBivariate = ko.observable('');
  self.pearson = ko.observable('');
  self.freqColumns = ko.observableArray([]);
  self.freqRows = ko.observableArray([]);
  self.freqTable = ko.observable(false);
  self.freqReady = ko.observable(false);
  self.x2 = ko.observable('');
  self.tschuprow = ko.observable('');

  self.attrToClean = ko.observable('');
  self.criteria = ko.observable('');
  self.recommendation = ko.observable('');

  self.valueTypeOptions = ['nominal', 'numerico' /*, ordinal*/];

  // *** Computed values ***
  self.noInstances = ko.pureComputed(function () {
    return self.grid().length - 1;
  }, self);

  self.noAttributes = ko.pureComputed(function () {
    return self.attributesInfo().length;
  }, self);

  self.totalMissingValues = ko.pureComputed(function () {
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

  self.totalPercentMissing = ko.pureComputed(function () {
    let percent = self.totalMissingValues() * 100 / (self.noInstances() * self.noAttributes());
    return percent.toFixed(2);
  }, self);

  self.attributeOptions = ko.pureComputed(function () {
    let attrArray = []
    if(self.grid()[0]){
      for (let i = 0; i < self.grid()[0].slots().length; i++) {
        attrArray.push({
          index: i, 
          name: self.grid()[0].slots()[i].value(),
          type: self.attributesInfo()[i].type()
        });
      }
    }
    return attrArray;
  }, self);

  // *** Functions ***
  self.loadData = function (data, options) {
    showLoading();
    setTimeout(() => {
      const defaultOptions = {
        generalInfo: '%% no info\n',
        relation: 'default_name',
        attr: { regex: '\\w{2}', type: 'nominal' },
        nullChar: ''
      };

      self.fileName(options.fileName);
      self.fileExt(options.fileExt);
      self.relation(options.relation || defaultOptions.relation);
      self.generalInfo(options.generalInfo || defaultOptions.generalInfo);
      self.nullChar(options.nullChar || defaultOptions.nullChar);

      if (options.fileExt === '.csv') {
        self.grid.splice(0);
        self.attributesInfo.splice(0);
        for (let i = 0; i < data[0].length; i++) {
          self.attributesInfo.push(new AttributeInfo(defaultOptions.attr.regex, defaultOptions.attr.type));
        }
        for (let row of data) {
          let slotsArray = [];
          for (let value of row) {
            slotsArray.push(new Slot(value, defaultOptions.attr.regex));
          }
          self.grid.push(new Row(slotsArray));
        }
      }
      else if (options.fileExt === '.data') {
        self.grid.splice(0);
        self.attributesInfo.splice(0);
        for (let i = 0; i < data[0].length; i++) {
          self.attributesInfo.push(new AttributeInfo(options.attrsInfo[i].regex, options.attrsInfo[i].type));
        }
        for (let row of data) {
          let slotsArray = [];
          for (let j = 0; j < row.length; j++) {
            slotsArray.push(new Slot(row[j], options.attrsInfo[j].regex));
          }
          self.grid.push(new Row(slotsArray));
        }
      }
      hideLoading();
    }, 0);
  }

  self.updateRegex = function (index) {
    for (let row of self.grid()) {
      let newRegex = self.attributesInfo()[index].regex();
      row.slots()[index].regex(newRegex);
    }
  }

  self.updateAttrInfo = function (index) {
    let countMissing = 0;
    let countBad = 0;

    for (var i = 1; i < self.grid().length; i++) {
      let missingValue = self.grid()[i].slots()[index].value() === self.nullChar() ? true : false;
      let badValue = self.grid()[i].slots()[index].status() === '' ? false : true;

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

  self.deleteAttr = function (index) {
    $('#attr' + index).modal('hide');
    showLoading();
    setTimeout(() => {
      for (let row of self.grid()) {
        row.slots.splice(index, 1);
      }
      self.attributesInfo.splice(index, 1);
      hideLoading();
    }, 0);
  }

  self.addAttr = function (name, regex, type, defaultValue) {
    $('#addAttr-modal').modal('hide');
    showLoading();
    setTimeout(() => {
      for (let i = 1; i < self.grid().length; i++) {
        self.grid()[i].slots.push(new Slot(defaultValue, regex));
      }
      
      self.attributesInfo.push(new AttributeInfo(regex, type));
      self.grid()[0].slots.push(new Slot(name, regex));
      hideLoading();
    }, 0);
  }

  self.deleteInstance = function (index) {
    $('#instanceModal' + index).modal('hide');
    showLoading();
    setTimeout(() => {
      self.grid.splice(index, 1);
      hideLoading();
    }, 0);
  }

  self.addInstance = function (defaultValue) {
    $('#addInstance-modal').modal('hide');
    showLoading();
    setTimeout(() => {
      let slotsArray = [];
      for (let attr of self.attributesInfo()) {
        slotsArray.push(new Slot(defaultValue, attr.regex()));
      }
      self.grid.push(new Row(slotsArray));
      hideLoading();
    }, 0);
  }

  self.fillMissingValues = function (fillWith) {
    $('#fillMissingValues-modal').modal('hide');
    showLoading();
    setTimeout(() => {
      for (let i = 1; i < self.grid().length; i++) {
        if (self.grid()[i].slots()[self.attrToClean().index].value() === self.nullChar()) {
          self.grid()[i].slots()[self.attrToClean().index].value(fillWith);
        }
      }
      hideLoading();
    }, 0);
  }

  self.searchAndReplace = function (searchVal, replaceVal) {
    $('#searchAndReplace-modal').modal('hide');
    showLoading();
    setTimeout(() => {
      for (let i = 1; i < self.grid().length; i++) {
        if (self.grid()[i].slots()[self.attrToClean().index].value() == searchVal) {
          self.grid()[i].slots()[self.attrToClean().index].value(replaceVal);
        }
      }
      hideLoading();
    }, 0);
  }
}

let vm = new DataViewModel();
ko.applyBindings(vm);
