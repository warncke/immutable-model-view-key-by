# immutable-model-view-key-by

Immutable Model View to collect records into object keyed by property value.

## Creating a new keyBy Model View

    const ModelViewKeyBy = require('immutable-model-view-key-by')

    var fooModel = new ImmutableCoreModel({
        name: 'foo',
        views: {
            default: ModelViewKeyBy('foo')
        }
    })

With ModelViewKeyBy('foo') set as the default view queries on fooModel will
return an object keyed by the property foo instead of an array of records.