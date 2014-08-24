'use strict';

var _ = require('lodash');
var Reflux = require('reflux');
var ReactWM = require('reactwm');

var actions = require('../actions');
var LocalStore = require('../utils/local');

var Editor = require('../components/editor.react');
var Import = require('../components/import.react');
var Export = require('../components/export.react');
var Template = require('../components/template.react');
var SchemeBrowser = require('../components/schemeBrowser.react');
var TemplateBrowser = require('../components/templateBrowser.react');
var ColorPicker = require('../components/colorPicker.react');
var Random = require('../components/random.react');

var STORAGE_ID = 'window::store';

var windows = {

  editor: function () {
    return {
      component: new Editor(),
      title: 'Editor',
      width: 460,
      height: 700
    };
  },

  import: function () {
    return {
      component: new Import(),
      title: 'Import',
      width: 330,
      height: 330,
      x: 500
    };
  },

  export: function () {
    return {
      component: new Export(),
      title: 'Export',
      width: 330,
      height: 330,
      x: 500,
      y: 370
    };
  },

  schemes: function () {
    return {
      component: new SchemeBrowser(),
      title: 'Scheme Browser',
      width: 330,
      height: 330,
      x: 850
    };
  },

  templates: function () {
    return {
      component: new TemplateBrowser(),
      title: 'Template Browser',
      width: 500,
      height: 200,
      x: 850,
      y: 370
    };
  },

  template: function (path) {
    return {
      component: new Template({ path: path }),
      id: 'template-' + path,
      title: 'Template: ' + path,
      width: 730,
      height: 580
    };
  },

  colorpicker: function () {
    return {
      component: new ColorPicker(),
      title: 'Color Picker',
      width: 500,
      height: 300,
      x: 20
    };
  },

  random: function () {
    return {
      component: new Random(),
      title: 'Randomiser',
      width: 200,
      height: 100,
      x: 50
    };
  },

};

var getWindow = function (id) {
  var _id = id.split('::');
  id = _id.splice(0, 1)[0];
 var  data = _id.join('::');

  return windows[id](data);
};


var manager = (function () {
  var localData = LocalStore.load(STORAGE_ID);
  var manager = new ReactWM.Manager(localData);

  manager.openWindows().forEach(function (window) {
    var info = getWindow(window.id);
    window.setComponent(info.component);
  });

  var _saveLayout = _.throttle(function () {
    LocalStore.save(STORAGE_ID, manager.toJSON());
  }, 500);

  manager.on('change', _saveLayout);
  manager.on('change:windows', _saveLayout);

  return manager;
}());


var WindowStore = Reflux.createStore({

  init: function () {
    this.listenTo(actions.openWindow, this.open);
  },

  getManager: function () {
    return manager;
  },

  open: function (id) {
    var window = getWindow(id);
    var el = window.component;
    manager.open(id, el, window);
  }

});

module.exports = WindowStore;