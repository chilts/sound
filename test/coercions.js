import _ from 'lodash'
import test from 'tape'
import sound from '../sound.js'

const coercionsForStrings = {
  percentage0 : sound().isString().toTrim().isRequired().isMatch(/^\d+$/).toInteger().isMinVal(0).isMaxVal(100),
  percentage1 : sound().isString().toTrim().isRequired().isMatch(/^\d+$/).toInteger().isMinVal(0).isMaxVal(100),
  percentage2 : sound().isString().toTrim().isRequired().isMatch(/^\d+$/).toInteger().isMinVal(0).isMaxVal(100),
  percentage3 : sound().isString().toTrim().isRequired().isMatch(/^\d+$/).toInteger().isMinVal(0).isMaxVal(100),
  percentage4 : sound().isString().toTrim().isRequired().isMatch(/^\d+$/).toInteger().isMinVal(0).isMaxVal(100),
  percentage5 : sound().isString().isRequired().toInteger().isMinVal(0).isMaxVal(100),
}

const coercionsToBooleans = {
  bool0 : sound().isInteger().toBoolean(),
  bool1 : sound().isInteger().toBoolean(),
  bool2 : sound().isString().toTrim().toBoolean(),
  bool3 : sound().isString().toTrim().toBoolean(),
  bool4 : sound().isString().toTrim().toBoolean(),
  bool5 : sound().isString().toTrim().toBoolean(),
  bool6 : sound().isString().toTrim().toBoolean(),
  bool7 : sound().isString().toTrim().toBoolean(),
  bool8 : sound().isString().toTrim().toBoolean(),
  bool9 : sound().isString().toTrim().toBoolean(),
  bool10 : sound().isString().toTrim().toBoolean(),
}

const coercionsToFloats = {
  float0 : sound().toFloat(),
  float1 : sound().toFloat(),
  float2 : sound().toFloat(),
  float3 : sound().toFloat(),
  float4 : sound().toFloat(),
  float5 : sound().toFloat(),
  float6 : sound().toFloat(),
  float7 : sound().toFloat(),
}

const tests = [

  {
    name : 'Coercions for Strings to Integers',
    schema : coercionsForStrings,
    params : {
      percentage0 : '-1',
      percentage1 : ' 0 ',
      percentage2 : ' 100 ',
      percentage3 : '101',
      percentage4 : '1.1',
      percentage5 : 'not a number',
    },
    test : function(t, err, res) {
      t.ok(_.isPlainObject(err), "err is an object")
      t.ok(_.isPlainObject(res), "res is an object")

      t.ok(!_.isUndefined(err.percentage0), "-1 fails the regex")
      t.ok(_.isUndefined(err.percentage1), "0 is ok")
      t.ok(_.isUndefined(err.percentage2), "100 is ok")
      t.ok(!_.isUndefined(err.percentage3), "101 is too high")
      t.ok(!_.isUndefined(err.percentage4), "1.1 fails the regex")
      t.ok(!_.isUndefined(err.percentage4), "'not a number' fails the coercion")

      t.equal(res.percentage0, undefined, 'percentage0 does not get returned')
      t.equal(res.percentage1, 0, 'percentage1 gets converted to an integer')
      t.equal(res.percentage2, 100, 'percentage2 gets converted to an integer')
      t.equal(res.percentage3, undefined, 'percentage3 does not get converted')
      t.equal(res.percentage4, undefined, 'percentage4 does not get converted')
      t.ok(!_.isNull(res.percentage5), 'percentage5 does not get converted')

      t.end()
    },
  },

  {
    name : 'Coercions for Strings to Booleans',
    schema : coercionsToBooleans,
    params : {
      bool0 : 0,
      bool1 : 1,
      bool2 : '0',
      bool3 : '1',
      bool4 : 'FALSE',
      bool5 : 'true',
      bool6 : ' No ',
      bool7 : 'yes ',
      bool8 : 'OFF',
      bool9 : ' On ',
      bool10 : 'invalid',
    },
    test : function(t, err, res) {
      t.ok(_.isPlainObject(err), "err is an object")
      t.ok(_.isPlainObject(res), "res is an object")

      t.ok( _.isUndefined(err.bool0), "0 is ok")
      t.ok( _.isUndefined(err.bool1), "1 is ok")
      t.ok( _.isUndefined(err.bool2), "'0' is ok")
      t.ok( _.isUndefined(err.bool3), "'1' is ok")
      t.ok( _.isUndefined(err.bool4), "true is ok")
      t.ok( _.isUndefined(err.bool5), "false is ok")
      t.ok( _.isUndefined(err.bool6), "yes is ok")
      t.ok( _.isUndefined(err.bool7), "no is ok")
      t.ok( _.isUndefined(err.bool8), "on is ok")
      t.ok( _.isUndefined(err.bool9), "off is ok")
      t.ok(!_.isUndefined(err.bool10), "invalid fails")

      t.equal(res.bool0, false, 'bool0')
      t.equal(res.bool1, true,  'bool1')
      t.equal(res.bool2, false, 'bool2')
      t.equal(res.bool3, true,  'bool3')
      t.equal(res.bool4, false, 'bool4')
      t.equal(res.bool5, true,  'bool5')
      t.equal(res.bool6, false, 'bool6')
      t.equal(res.bool7, true,  'bool7')
      t.equal(res.bool8, false, 'bool8')
      t.equal(res.bool9, true,  'bool9')
      t.equal(res.bool10, undefined, 'bool10')

      t.end()
    },
  },

  {
    name : 'Coercions for Strings to Floats',
    schema : coercionsToFloats,
    params : {
      float0 : 0,
      float1 : 1,
      float2 : '0',
      float3 : '1',
      float4 : '0.1',
      float5 : '-0.1',
      float6 : '3.14159',
      float7 : 'invalid',
    },
    test : function(t, err, res) {
      t.ok(_.isPlainObject(err), "err is an object")
      t.ok(_.isPlainObject(res), "res is an object")

      t.ok( _.isUndefined(err.float0), "0 is ok")
      t.ok( _.isUndefined(err.float1), "1 is ok")
      t.ok( _.isUndefined(err.float2), "'0' is ok")
      t.ok( _.isUndefined(err.float3), "'1' is ok")
      t.ok( _.isUndefined(err.float4), "true is ok")
      t.ok( _.isUndefined(err.float5), "false is ok")
      t.ok( _.isUndefined(err.float6), "yes is ok")
      t.ok(!_.isUndefined(err.float7), "invalid fails")

      t.equal(res.float0, 0,       'float0')
      t.equal(res.float1, 1,       'float1')
      t.equal(res.float2, 0,       'float2')
      t.equal(res.float3, 1,       'float3')
      t.equal(res.float4, 0.1,     'float4')
      t.equal(res.float5, -0.1,    'float5')
      t.equal(res.float6, 3.14159, 'float6')
      t.ok(!_.isNull(res.float7),  'float7')

      t.end()
    },
  },

]

tests.forEach(function(v) {
  test(v.name, function(t) {
    const res = sound.validate(v.params, v.schema)
    v.test(t, res.err, res.val)
  })
})
