'use strict';

var { __namespace } = require('../../../../index')
var entryFactory = require('../../../../factory/EntryFactory');

var cmdHelper = require('../../../../helper/CmdHelper');

module.exports = function(element, bpmnFactory, options, translate) {

  var getBusinessObject = options.getBusinessObject;

  var jobPriorityEntry = entryFactory.textField({
    id: 'jobPriority',
    label: translate('Job Priority'),
    modelProperty: 'jobPriority',

    get: function(element, node) {
      var bo = getBusinessObject(element);
      return {
        jobPriority: bo.get(`${__namespace}:jobPriority`)
      };
    },

    set: function(element, values) {
      var bo = getBusinessObject(element);
      var obj = {};
      obj[`${__namespace}:jobPriority`] = values.jobPriority || undefined;
      return cmdHelper.updateBusinessObject(element, bo, obj);
    }

  });

  return [ jobPriorityEntry ];

};
