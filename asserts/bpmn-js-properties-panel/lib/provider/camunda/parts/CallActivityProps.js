'use strict';

var { __namespace } = require('../../../index')
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    is = require('bpmn-js/lib/util/ModelUtil').is;

var entryFactory = require('../../../factory/EntryFactory');

var callable = require('./implementation/Callable');

var cmdHelper = require('../../../helper/CmdHelper');

var flattenDeep = require('lodash/flattenDeep');
var assign = require('lodash/assign');

function getCallableType(element) {
  var bo = getBusinessObject(element);

  var boCalledElement = bo.get('calledElement'),
      boCaseRef = bo.get(`${__namespace}:caseRef`);

  var callActivityType = '';
  if (typeof boCalledElement !== 'undefined') {
    callActivityType = 'bpmn';
  } else

  if (typeof boCaseRef !== 'undefined') {
    callActivityType = 'cmmn';
  }

  return callActivityType;
}

var DEFAULT_PROPS = {
  calledElement: undefined
};
DEFAULT_PROPS[`${__namespace}:calledElementBinding`] = 'latest';
DEFAULT_PROPS[`${__namespace}:calledElementVersion`] = undefined;
DEFAULT_PROPS[`${__namespace}:calledElementTenantId`] = undefined;
DEFAULT_PROPS[`${__namespace}:variableMappingClass`] = undefined;
DEFAULT_PROPS[`${__namespace}:variableMappingDelegateExpression`] = undefined;
DEFAULT_PROPS[`${__namespace}:caseRef`] = undefined;
DEFAULT_PROPS[`${__namespace}:caseBinding`] = 'latest';
DEFAULT_PROPS[`${__namespace}:caseVersion`] = undefined;
DEFAULT_PROPS[`${__namespace}:caseTenantId`] = undefined;

module.exports = function(group, element, bpmnFactory, translate) {

  if (!is(element, `${__namespace}:CallActivity`)) {
    return;
  }

  group.entries.push(entryFactory.selectBox({
    id : 'callActivity',
    label: translate('CallActivity Type'),
    selectOptions: [
      { name: 'BPMN', value: 'bpmn' },
      { name: 'CMMN', value: 'cmmn' }
    ],
    emptyParameter: true,
    modelProperty: 'callActivityType',

    get: function(element, node) {
      return {
        callActivityType: getCallableType(element)
      };
    },

    set: function(element, values, node) {
      var type = values.callActivityType;

      var props = assign({}, DEFAULT_PROPS);

      if (type === 'bpmn') {
        props.calledElement = '';
      }
      else if (type === 'cmmn') {
        props[`${__namespace}:caseRef`] = '';
      }

      return cmdHelper.updateProperties(element, props);
    }

  }));

  group.entries.push(callable(element, bpmnFactory, {
    getCallableType: getCallableType
  }, translate));

  group.entries = flattenDeep(group.entries);
};
