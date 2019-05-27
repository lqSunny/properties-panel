'use strict';

var { __namespace } = require('../../../../index')
var assign = require('lodash/assign');

var entryFactory = require('../../../../factory/EntryFactory');

var asyncCapableHelper = require('../../../../helper/AsyncCapableHelper'),
    eventDefinitionHelper = require('../../../../helper/EventDefinitionHelper'),
    cmdHelper = require('../../../../helper/CmdHelper');

function isAsyncBefore(bo) {
  return asyncCapableHelper.isAsyncBefore(bo);
}

function isAsyncAfter(bo) {
  return asyncCapableHelper.isAsyncAfter(bo);
}

function isExclusive(bo) {
  return asyncCapableHelper.isExclusive(bo);
}

function removeFailedJobRetryTimeCycle(bo, element) {
  return asyncCapableHelper.removeFailedJobRetryTimeCycle(bo, element);
}

function canRemoveFailedJobRetryTimeCycle(element) {
  return !eventDefinitionHelper.getTimerEventDefinition(element);
}

module.exports = function(element, bpmnFactory, options, translate) {

  var getBusinessObject = options.getBusinessObject;

  var idPrefix = options.idPrefix || '',
      labelPrefix = options.labelPrefix || '';


  var asyncBeforeEntry = entryFactory.checkbox({
    id: idPrefix + 'asyncBefore',
    label: labelPrefix + translate('Asynchronous Before'),
    modelProperty: 'asyncBefore',

    get: function(element, node) {
      var bo = getBusinessObject(element);
      return {
        asyncBefore: isAsyncBefore(bo)
      };
    },

    set: function(element, values) {
      var bo = getBusinessObject(element);
      var asyncBefore = !!values.asyncBefore;

      var props = {};
      props[`${__namespace}:asyncBefore`] = asyncBefore;
      props[`${__namespace}:async`] = false;

      var commands = [];
      if (!isAsyncAfter(bo) && !asyncBefore) {
        var obj = {};
        obj[`${__namespace}:exclusive`] = true;
        props = assign(obj, props);
        if (canRemoveFailedJobRetryTimeCycle(element)) {
          commands.push(removeFailedJobRetryTimeCycle(bo, element));
        }
      }

      commands.push(cmdHelper.updateBusinessObject(element, bo, props));
      return commands;
    }
  });


  var asyncAfterEntry = entryFactory.checkbox({
    id: idPrefix + 'asyncAfter',
    label: labelPrefix + translate('Asynchronous After'),
    modelProperty: 'asyncAfter',

    get: function(element, node) {
      var bo = getBusinessObject(element);
      return {
        asyncAfter: isAsyncAfter(bo)
      };
    },

    set: function(element, values) {
      var bo = getBusinessObject(element);
      var asyncAfter = !!values.asyncAfter;

      var props = {};
      props[`${__namespace}:asyncAfter`] = asyncAfter;

      var commands = [];
      if (!isAsyncBefore(bo) && !asyncAfter) {
        var obj = {};
        obj[`${__namespace}:exclusive`] = true;
        props = assign(obj, props);
        if (canRemoveFailedJobRetryTimeCycle(element)) {
          commands.push(removeFailedJobRetryTimeCycle(bo, element));
        }
      }

      commands.push(cmdHelper.updateBusinessObject(element, bo, props));
      return commands;
    }
  });


  var exclusiveEntry = entryFactory.checkbox({
    id: idPrefix + 'exclusive',
    label: labelPrefix + translate('Exclusive'),
    modelProperty: 'exclusive',

    get: function(element, node) {
      var bo = getBusinessObject(element);
      return { exclusive: isExclusive(bo) };
    },

    set: function(element, values) {
      var bo = getBusinessObject(element);
      var obj = {};
      obj[`${__namespace}:exclusive`] = !!values.exclusive;
      return cmdHelper.updateBusinessObject(element, bo, obj);
    },

    hidden: function(element) {
      var bo = getBusinessObject(element);
      return bo && !isAsyncAfter(bo) && !isAsyncBefore(bo);
    }
  });

  return [ asyncBeforeEntry, asyncAfterEntry, exclusiveEntry ];
};
