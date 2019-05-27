'use strict';

var { __namespace } = require('../../../../index')
var is = require('bpmn-js/lib/util/ModelUtil').is;

var assign = require('lodash/assign');

var entryFactory = require('../../../../factory/EntryFactory'),
    cmdHelper = require('../../../../helper/CmdHelper');

module.exports = function(element, bpmnFactory, options, translate) {

  var getBusinessObject = options.getBusinessObject,
      hideResultVariable = options.hideResultVariable,
      id = options.id || 'resultVariable';


  var resultVariableEntry = entryFactory.textField({
    id: id,
    label: translate('Result Variable'),
    modelProperty: 'resultVariable',

    get: function(element, node) {
      var bo = getBusinessObject(element);
      return { resultVariable: bo.get(`${__namespace}:resultVariable`) };
    },

    set: function(element, values, node) {
      var bo = getBusinessObject(element);

      var resultVariable = values.resultVariable || undefined;

      var props = {};
      props[`${__namespace}:resultVariable`] = resultVariable;

      if (is(bo, `${__namespace}:DmnCapable`) && !resultVariable) {
        var obj = {};
        obj[`${__namespace}:mapDecisionResult`] = 'resultList';
        props = assign(obj, props);
      }

      return cmdHelper.updateBusinessObject(element, bo, props);
    },

    hidden: function(element, node) {
      if (typeof hideResultVariable === 'function') {
        return hideResultVariable.apply(resultVariableEntry, arguments);
      }
    }

  });

  return [ resultVariableEntry ];

};
