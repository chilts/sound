import _ from 'lodash'
import test from 'tape'
import sound from '../sound.js'

const conversions = {
  username0 : sound().isString().toTrim().isRequired().isMinLen(4),
  username1 : sound().isString().toTrim().isRequired().setName('Username1'),
  username2 : sound().isString().isRequired().toLowerCase().setName('Username2'),
  username3 : sound().isString().isRequired().toReplace('_', '-').setName('Username3'),
  username4 : sound().isString().toTrim().toLowerCase().isRequired().toReplace(/_/g, '-').setName('Username4'),
  username5 : sound().isString().toTrim().toUpperCase().isRequired().toReplace(/[^A-Za-z0-9]+/g, '-').setName('Username5'),
  ageString : sound().isInteger().isRequired().toString().setName('ageString'),
  badBool   : sound().toBoolean().setName('badBool'),
  badInt    : sound().isInteger().setName('badInt'),
  badVal    : sound().isInteger().isEqual(12).setName('badVal'),
  notEmpty  : sound().isString().isNotEmpty().setName('notEmpty'),
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
      username5 : '  Right here   ',
      ageString : 20,
      badBool   : new Date(),
      badInt    : true,
      badVal    : 13,
      notEmpty  : ' ', // gets us past the default '' check
    },
    test : function(t, err, res) {
      t.ok(_.isPlainObject(err), "err is an object")
      t.ok(_.isPlainObject(res), "res is an object")

      t.ok(!_.isUndefined(err.username0), "string fails")
      t.ok(_.isUndefined(err.username1), "string passes")
      t.ok(_.isUndefined(err.username2), "string passes")
      t.ok(_.isUndefined(err.username3), "string passes")
      t.ok(_.isUndefined(err.username4), "string passes")
      t.ok(_.isUndefined(err.username5), "string passes")
      t.ok(_.isUndefined(err.ageString), "int to string passes")
      t.equal(err.badBool, 'badBool value should be a string or integer when converting to boolean', "bad boolean value for conversion")
      t.equal(err.badInt, 'badInt should be an integer', "bad int value for conversion")
      t.equal(err.badVal, 'badVal should be 12', "bad int value for conversion")
      t.equal(err.notEmpty, 'notEmpty should be provided', "notEmpty is empty")

      t.equal(res.username0, undefined, 'username0 does not get converted')
      t.equal(res.username1, 'andy', 'username1 gets trimmed')
      t.equal(res.username2, 'andy', 'username2 gets lower cased')
      t.equal(res.username3, 'the-boss', 'username3 gets lower cases and looks like a username')
      t.equal(res.username4, 'the-big-boss', 'username4 gets converted as username4 and also trimmed')
      t.equal(res.username5, 'RIGHT-HERE', 'username5 trimmed, upper cased, and converted to a username')
      t.equal(res.ageString, '20', 'age gets converted to a string')
      t.ok(_.isUndefined(res.badBool), "badBool is not valid")
      t.ok(_.isUndefined(res.badInt), "badInt is not valid")
      t.ok(_.isUndefined(res.badVal), "badVal is not valid")
      t.ok(_.isUndefined(res.notEmpty), "notEmpty is not valid")

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
