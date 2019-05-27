'use strict';

var { __namespace } = require('../../../../index')
var entryFactory = require('../../../../factory/EntryFactory');

var cmdHelper = require('../../../../helper/CmdHelper');

module.exports = function(element, bpmnFactory, options, translate) {

  var getBusinessObject = options.getBusinessObject;

  var historyTimeToLiveEntry = entryFactory.textField({
    id: 'historyTimeToLive',
    label: translate('History Time To Live'),
    modelProperty: 'historyTimeToLive',

    get: function(element, node) {
      var bo = getBusinessObject(element);
      var historyTimeToLive = bo.get(`${__namespace}:historyTimeToLive`);

      return {
        historyTimeToLive: historyTimeToLive ? historyTimeToLive : ''
      };
    },

    set: function(element, values) {
      var bo = getBusinessObject(element);
      var obj = {};
      obj[`${__namespace}:historyTimeToLive`] = values.historyTimeToLive || undefined;
      return cmdHelper.updateBusinessObject(element, bo, obj);
    }

  });

  return [ historyTimeToLiveEntry ];
};
