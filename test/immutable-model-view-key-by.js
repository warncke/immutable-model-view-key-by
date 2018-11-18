'use strict'

const ImmutableAccessControl = require('immutable-access-control')
const ImmutableCoreModel = require('immutable-core-model')
const ModelViewKeyBy = require('../lib/immutable-model-view-key-by')
const Promise = require('bluebird')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const immutable = require('immutable-core')

chai.use(chaiAsPromised)
const assert = chai.assert

const dbHost = process.env.DB_HOST || 'localhost'
const dbName = process.env.DB_NAME || 'test'
const dbPass = process.env.DB_PASS || ''
const dbUser = process.env.DB_USER || 'root'

// use the same params for all connections
const connectionParams = {
    database: dbName,
    host: dbHost,
    password: dbPass,
    user: dbUser,
}

describe('immutable-model-view-key-by', function () {

    // fake session to use for testing
    var session = {
        accountId: '11111111111111111111111111111111',
        roles: ['all', 'authenticated'],
        sessionId: '22222222222222222222222222222222',
    }

    var glboalFooModel

    var mysql, origBam, origBar, origFoo, origRecords

    before(async function () {
        // reset immutable global data
        immutable.reset().strictArgs(false)
        ImmutableAccessControl.reset()
        // create database client
        mysql = await ImmutableCoreModel.createMysqlConnection(connectionParams)
        // create initial model
        glboalFooModel = new ImmutableCoreModel({
            mysql: mysql,
            name: 'foo',
            views: {
                default: ModelViewKeyBy('foo')
            }
        })
        // setup data to perform queries
        try {
            // drop any test tables if they exist
            await mysql.query('DROP TABLE IF EXISTS foo')
            // sync with database
            await glboalFooModel.sync()
            // create instances with different data values for testing
            origBam = await glboalFooModel.createMeta({
                data: {
                    bar: "0.000000000",
                    foo: 'bam',
                },
                session: session,
            })
            origBar = await glboalFooModel.createMeta({
                data: {
                    bar: "1.000000000",
                    foo: 'bar',
                },
                session: session,
            })
            origFoo = await glboalFooModel.createMeta({
                data: {
                    bar: "2.000000000",
                    foo: 'foo',
                },
                session: session,
            })
            // list of original records in order added
            origRecords = [origBam, origBar, origFoo]
        }
        catch (err) {
            throw err
        }
    })

    it('should return records keyed by foo', async function () {
        // get all records which should have foo model view applied
        try {
            var foo = await glboalFooModel.query({
                all: true,
                order: ['createTime'],
                session: session,
            })
        }
        catch (err) {
            assert.ifError(err)
        }

        assert.deepEqual(foo, {
            bam: { bar: '0.000000000', foo: 'bam' },
            bar: { bar: '1.000000000', foo: 'bar' },
            foo: { bar: '2.000000000', foo: 'foo' },
        })
    })

})