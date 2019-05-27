'use strict';

var { __namespace } = require('../../../../index')
var entryFactory = require('../../../../factory/EntryFactory');

var cmdHelper = require('../../../../helper/CmdHelper');

module.exports = function(element, bpmnFactory, options, translate) {

  var getBusinessObject = options.getBusinessObject;

  var externalTaskPriorityEntry = entryFactory.textField({
    id: 'externalTaskPriority',
    label: translate('Task Priority'),
    modelProperty: 'taskPriority',

    get: function(element, node) {
      var bo = getBusinessObject(element);
      return {
        taskPriority: bo.get(`${__namespace}:taskPriority`)
      };
    },

    set: function(element, values) {
      var bo = getBusinessObject(element);
      var obj = {};
      obj[`${__namespace}:taskPriority`] = values.taskPriority || undefined;
      return cmdHelper.updateBusinessObject(element, bo, obj);
    }

  });

  return [ externalTaskPriorityEntry ];

};
