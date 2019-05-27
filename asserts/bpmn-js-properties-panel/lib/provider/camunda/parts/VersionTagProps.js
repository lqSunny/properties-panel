'use strict';

var { __namespace } = require('../../../index')
var entryFactory = require('../../../factory/EntryFactory'),
    cmdHelper = require('../../../helper/CmdHelper'),
    is = require('bpmn-js/lib/util/ModelUtil').is,
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

module.exports = function(group, element, translate) {

  var bo = getBusinessObject(element);

  if (!bo) {
    return;
  }

  if (is(element, 'bpmn:Process') || is(element, 'bpmn:Participant') && bo.get('processRef')) {
    var versionTagEntry = entryFactory.textField({
      id: 'versionTag',
      label: translate('Version Tag'),
      modelProperty: 'versionTag'
    });

    // in participants we have to change the default behavior of set and get
    if (is(element, 'bpmn:Participant')) {
      versionTagEntry.get = function(element) {
        var processBo = bo.get('processRef');

        return {
          versionTag: processBo.get(`${__namespace}:versionTag`)
        };
      };

      versionTagEntry.set = function(element, values) {
        var processBo = bo.get('processRef');

        var obj = {};
        obj[`${__namespace}:versionTag`] = values.versionTag || undefined;
        return cmdHelper.updateBusinessObject(element, processBo, obj);
      };
    }

    group.entries.push(versionTagEntry);

  }
};
