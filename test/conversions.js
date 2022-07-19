import * as _ from 'underscore'
import test from 'tape'
import sound from '../sound.js'

const conversions = {
  username0 : sound().isString().toTrim().isRequired().isMinLen(4),
  username1 : sound().isString().toTrim().isRequired().setName('Username1'),
  username2 : sound().isString().isRequired().toLowerCase().setName('Username2'),
  username3 : sound().isString().isRequired().toReplace('_', '-').setName('Username3'),
  username4 : sound().isString().toTrim().toLowerCase().isRequired().toReplace(/_/g, '-').setName('Username4'),
  ageString : sound().isInteger().isRequired().toString().setName('ageString'),
  badBool   : sound().toBoolean().setName('badBool'),
}

const tests = [

  {
    name : 'Some simple converstions on .isString() types',
    schema : conversions,
    params : {
      username0 : '    ',
      username1 : ' andy   ',
      username2 : 'ANDY',
      username3 : 'the_boss',
      username4 : 'the_BIG_boss   ',
      ageString : 20,
      badBool   : new Date(),
    },
    test : function(t, err, res) {
      t.ok(_.isObject(err), "err is an object")
      t.ok(_.isObject(res), "res is an object")

      t.ok(!_.isUndefined(err.username0), "string fails")
      t.ok(_.isUndefined(err.username1), "string passes")
      t.ok(_.isUndefined(err.username2), "string passes")
      t.ok(_.isUndefined(err.username3), "string passes")
      t.ok(_.isUndefined(err.username4), "string passes")
      t.ok(_.isUndefined(err.ageString), "int to string passes")
      t.equal(err.badBool, 'badBool value should be a string or integer when converting to boolean', "bad boolean value for conversion")

      t.equal(res.username0, undefined, 'username0 does not get converted')
      t.equal(res.username1, 'andy', 'username0 gets converted to the empty string')
      t.equal(res.username2, 'andy', 'username0 gets converted to the empty string')
      t.equal(res.username3, 'the-boss', 'username0 gets converted to the empty string')
      t.equal(res.username4, 'the-big-boss', 'username0 gets converted to the empty string')
      t.equal(res.ageString, '20', 'age gets converted to a string')
      t.ok(_.isUndefined(res.badBool), "badBool is not valid")

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
