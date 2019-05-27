var obj = {};
obj.start = (namespace) => {
    obj.__namespace = namespace || 'camunda'
    return {
        __depends__: [
            require('./cmd'),
            require('diagram-js/lib/i18n/translate').default
        ],
        __init__: [ 'propertiesPanel' ],
        propertiesPanel: [ 'type', require('./PropertiesPanel') ]
    }
};
module.exports = obj;