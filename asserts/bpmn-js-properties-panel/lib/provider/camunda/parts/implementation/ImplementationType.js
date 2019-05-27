'use strict';

var { __namespace } = require('../../../../index')
var entryFactory = require('../../../../factory/EntryFactory'),
    cmdHelper = require('../../../../helper/CmdHelper'),
    extensionElementsHelper = require('../../../../helper/ExtensionElementsHelper'),
    elementHelper = require('../../../../helper/ElementHelper');

var assign = require('lodash/assign');
var map = require('lodash/map');

var DEFAULT_DELEGATE_PROPS = [ 'class', 'expression', 'delegateExpression' ];

var DELEGATE_PROPS = {};
DELEGATE_PROPS[`${__namespace}:class`] = undefined;
DELEGATE_PROPS[`${__namespace}:expression`] = undefined;
DELEGATE_PROPS[`${__namespace}:delegateExpression`] = undefined;
DELEGATE_PROPS[`${__namespace}:resultVariable`] = undefined;

var DMN_CAPABLE_PROPS = {};
DMN_CAPABLE_PROPS[`${__namespace}:decisionRef`] = undefined;
DMN_CAPABLE_PROPS[`${__namespace}:decisionRefBinding`] = 'latest';
DMN_CAPABLE_PROPS[`${__namespace}:decisionRefVersion`] = undefined;
DMN_CAPABLE_PROPS[`${__namespace}:mapDecisionResult`] = 'resultList';
DMN_CAPABLE_PROPS[`${__namespace}:decisionRefTenantId`] =undefined ;


var EXTERNAL_CAPABLE_PROPS = {};
EXTERNAL_CAPABLE_PROPS[`${__namespace}:type`] = undefined;
EXTERNAL_CAPABLE_PROPS[`${__namespace}:topic`] = undefined;

module.exports = function(element, bpmnFactory, options, translate) {

  var DEFAULT_OPTIONS = [
    { value: 'class', name: translate('Java Class') },
    { value: 'expression', name: translate('Expression') },
    { value: 'delegateExpression', name: translate('Delegate Expression') }
  ];

  var DMN_OPTION = [
    { value: 'dmn', name: translate('DMN') }
  ];

  var EXTERNAL_OPTION = [
    { value: 'external', name: translate('External') }
  ];

  var CONNECTOR_OPTION = [
    { value: 'connector', name: translate('Connector') }
  ];

  var SCRIPT_OPTION = [
    { value: 'script', name: translate('Script') }
  ];

  var getType = options.getImplementationType,
      getBusinessObject = options.getBusinessObject;

  var hasDmnSupport = options.hasDmnSupport,
      hasExternalSupport = options.hasExternalSupport,
      hasServiceTaskLikeSupport = options.hasServiceTaskLikeSupport,
      hasScriptSupport = options.hasScriptSupport;

  var entries = [];

  var selectOptions = DEFAULT_OPTIONS.concat([]);

  if (hasDmnSupport) {
    selectOptions = selectOptions.concat(DMN_OPTION);
  }

  if (hasExternalSupport) {
    selectOptions = selectOptions.concat(EXTERNAL_OPTION);
  }

  if (hasServiceTaskLikeSupport) {
    selectOptions = selectOptions.concat(CONNECTOR_OPTION);
  }

  if (hasScriptSupport) {
    selectOptions = selectOptions.concat(SCRIPT_OPTION);
  }

  selectOptions.push({ value: '' });

  entries.push(entryFactory.selectBox({
    id : 'implementation',
    label: translate('Implementation'),
    selectOptions: selectOptions,
    modelProperty: 'implType',

    get: function(element, node) {
      return {
        implType: getType(element) || ''
      };
    },

    set: function(element, values, node) {
      var bo = getBusinessObject(element);
      var oldType = getType(element);
      var newType = values.implType;

      var props = assign({}, DELEGATE_PROPS);

      if (DEFAULT_DELEGATE_PROPS.indexOf(newType) !== -1) {

        var newValue = '';
        if (DEFAULT_DELEGATE_PROPS.indexOf(oldType) !== -1) {
          newValue = bo.get(`${__namespace}:` + oldType);
        }
        props[`${__namespace}:` + newType] = newValue;
      }

      if (hasDmnSupport) {
        props = assign(props, DMN_CAPABLE_PROPS);
        if (newType === 'dmn') {
          props[`${__namespace}:decisionRef`] = '';
        }
      }

      if (hasExternalSupport) {
        props = assign(props, EXTERNAL_CAPABLE_PROPS);
        if (newType === 'external') {
          props[`${__namespace}:type`] = 'external';
          props[`${__namespace}:topic`] = '';
        }
      }

      if (hasScriptSupport) {
        props[`${__namespace}:script`] = undefined;

        if (newType === 'script') {
          props[`${__namespace}:script`] = elementHelper.createElement(`${__namespace}:Script`, {}, bo, bpmnFactory);
        }
      }

      var commands = [];
      commands.push(cmdHelper.updateBusinessObject(element, bo, props));

      if (hasServiceTaskLikeSupport) {
        var connectors = extensionElementsHelper.getExtensionElements(bo, `${__namespace}:Connector`);
        commands.push(map(connectors, function(connector) {
          return extensionElementsHelper.removeEntry(bo, element, connector);
        }));

        if (newType === 'connector') {
          var extensionElements = bo.get('extensionElements');
          if (!extensionElements) {
            extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
            commands.push(cmdHelper.updateBusinessObject(element, bo, { extensionElements: extensionElements }));
          }
          var connector = elementHelper.createElement(`${__namespace}:Connector`, {}, extensionElements, bpmnFactory);
          commands.push(cmdHelper.addAndRemoveElementsFromList(
            element,
            extensionElements,
            'values',
            'extensionElements',
            [ connector ],
            []
          ));
        }
      }

      return commands;

    }
  }));

  return entries;

};
