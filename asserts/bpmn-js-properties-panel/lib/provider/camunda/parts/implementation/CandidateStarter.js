'use strict';

var { __namespace } = require('../../../../index')
var entryFactory = require('../../../../factory/EntryFactory');

var cmdHelper = require('../../../../helper/CmdHelper');

module.exports = function(element, bpmnFactory, options, translate) {

  var getBusinessObject = options.getBusinessObject;

  var candidateStarterGroupsEntry = entryFactory.textField({
    id: 'candidateStarterGroups',
    label: translate('Candidate Starter Groups'),
    modelProperty: 'candidateStarterGroups',
    description: translate('Specify more than one group as a comma separated list.'),

    get: function(element, node) {
      var bo = getBusinessObject(element);
      var candidateStarterGroups = bo.get(`${__namespace}:candidateStarterGroups`);

      return {
        candidateStarterGroups: candidateStarterGroups ? candidateStarterGroups : ''
      };
    },

    set: function(element, values) {
      var bo = getBusinessObject(element);
      var obj = {};
      obj[`${__namespace}:candidateStarterGroups`] = values.candidateStarterGroups || undefined;
      return cmdHelper.updateBusinessObject(element, bo, obj);
    }

  });

  var candidateStarterUsersEntry = entryFactory.textField({
    id: 'candidateStarterUsers',
    label: translate('Candidate Starter Users'),
    modelProperty: 'candidateStarterUsers',
    description: translate('Specify more than one user as a comma separated list.'),

    get: function(element, node) {
      var bo = getBusinessObject(element);
      var candidateStarterUsers = bo.get(`${__namespace}:candidateStarterUsers`);

      return {
        candidateStarterUsers: candidateStarterUsers ? candidateStarterUsers : ''
      };
    },

    set: function(element, values) {
      var bo = getBusinessObject(element);
      var obj = {};
      obj[`${__namespace}:candidateStarterUsers`] = values.candidateStarterUsers || undefined;
      return cmdHelper.updateBusinessObject(element, bo, obj);
    }

  });

  return [
    candidateStarterGroupsEntry,
    candidateStarterUsersEntry
  ];
};
