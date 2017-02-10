'use strict'

/* npm modules */
const ImmutableCoreModelView = require('immutable-core-model-view')

/* exports */
module.exports = new ImmutableCoreModelView({
    each: function (modelView, record, number, context) {
        // index data by property
        context[record[modelView.args.properties[0]]] = record
    },
    name: 'keyBy',
    type: 'collection',
})