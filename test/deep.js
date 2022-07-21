import _ from 'lodash'
import test from 'tape'
import sound from '../sound.js'

const result = {
  status: sound().isInteger().isRequired().isEqual(200),
  payload: sound().isObject().isRequired(),
}

const todo = {
  items: sound().isArray().isRequired(),
}

const tests = [

  {
    name: 'Check a simple ok result',
    schema: result,
    args: {
      ok: true,
      status: 200,
      payload: {},
    },
    test: function(t, res) {
      t.ok(_.isPlainObject(res), "is an object")

      const { ok, err, val } = res
      t.equal(ok, true, 'Result passes')
      t.ok(_.isPlainObject(err), "is an object")
      t.ok(_.isPlainObject(val), "is an object")

      t.ok( _.isUndefined(err.status), "status passes")
      t.ok( _.isUndefined(err.payload), "payload passes")

      t.equal(val.status, 200, 'status is as expected')
      t.deepEqual(val.payload, {}, 'payload is as expected')

      t.end()
    },
  },

  {
    name: 'Check a simple ok result that does not have anything',
    schema: result,
    args: {},
    test: function(t, res) {
      t.ok(_.isPlainObject(res), "is an object")

      const { ok, err, val } = res
      t.equal(ok, false, 'Result fails')
      t.ok(_.isPlainObject(err), "is an object")
      t.ok(_.isPlainObject(val), "is an object")

      t.equal(err.status, 'status is required', 'status is as expected')
      t.deepEqual(err.payload, 'payload is required', 'payload is as expected')

      t.ok( _.isUndefined(val.status), "status is (correctly) missing")
      t.ok( _.isUndefined(val.payload), "payload is (correctly) missing")

      t.end()
    },
  },

  {
    name: 'Check a simple result that has the wrong types',
    schema: result,
    args: {
      status: 'sdf',
      payload: new Date(),
    },
    test: function(t, res) {
      t.ok(_.isPlainObject(res), "is an object")

      const { ok, err, val } = res
      t.equal(ok, false, 'Result passes')
      t.ok(_.isPlainObject(err), "is an object")
      t.ok(_.isPlainObject(val), "is an object")

      t.equal(err.status, 'status should be an integer', 'status is as expected')
      t.deepEqual(err.payload, 'payload should be an object', 'payload is as expected')

      t.ok( _.isUndefined(val.status), "status is (correctly) missing")
      t.ok( _.isUndefined(val.payload), "payload is (correctly) missing")

      t.end()
    },
  },

  {
    name: 'Check a simple array',
    schema: todo,
    args: {
      items: [],
    },
    test: function(t, res) {
      t.ok(_.isPlainObject(res), "is an object")

      const { ok, err, val } = res
      t.equal(ok, true, 'Result passes')
      t.ok(_.isPlainObject(err), "is an object")
      t.ok(_.isPlainObject(val), "is an object")

      t.ok( _.isUndefined(err.items), "items passes")

      t.deepEqual(val.items, [], 'items is as expected')

      t.end()
    },
  },

  {
    name: 'Check a simple array that is missing',
    schema: todo,
    args: {},
    test: function(t, res) {
      t.ok(_.isPlainObject(res), "is an object")

      const { ok, err, val } = res
      t.equal(ok, false, 'Result passes')
      t.ok(_.isPlainObject(err), "is an object")
      t.ok(_.isPlainObject(val), "is an object")

      t.equal(err.items, 'items is required', 'err.items is as expected')

      t.ok( _.isUndefined(val.items), "items (correctly) missing")

      t.end()
    },
  },

  {
    name: 'Check a simple array that is the wrong type',
    schema: todo,
    args: {
      items: new Date(),
    },
    test: function(t, res) {
      t.ok(_.isPlainObject(res), "is an object")

      const { ok, err, val } = res
      t.equal(ok, false, 'Result passes')
      t.ok(_.isPlainObject(err), "is an object")
      t.ok(_.isPlainObject(val), "is an object")

      t.equal(err.items, 'items should be an array', 'err.items is as expected')

      t.ok( _.isUndefined(val.items), "items is (correctly) missing")

      t.end()
    },
  },

]

tests.forEach(function(v) {
  test(v.name, function(t) {
    const res = sound.validate(v.args, v.schema)
    v.test(t, res)
  })
})
