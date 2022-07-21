import _ from 'lodash'
import test from 'tape'
import sound from '../sound.js'

const tests = [

  {
    name : 'Default simple strings (1)',
    schema : {
      greeting1 : sound().isString().hasDefault('hello'),
      greeting2 : sound().isString().hasDefault('hi'),
      greeting3 : sound().isString().hasDefault('Yo!'),
      greeting4 : sound().isString().hasDefault('Wassup'),
      greetingA : sound().isString().hasDefault('Cheers'),
      greetingB : sound().isString().hasDefault(''),

      greeting5 : sound().isString().hasDefault('hello').isRequired(),
      greeting6 : sound().isString().hasDefault('hi').isRequired(),
      greeting7 : sound().isString().hasDefault('Yo!').isRequired(),
      greeting8 : sound().isString().hasDefault('Wassup').isRequired(),
      greetingC : sound().isString().hasDefault('Cheers').isRequired(),
      greetingD : sound().isString().hasDefault('').isRequired(),
    },
    params : {
      greeting1 : 'Alright?',
      greeting2 : "G'Day",
      greeting5 : 'Alright?',
      greeting6 : "G'Day",
      greetingA : '',
      greetingB : '',
    },
    test : function(t, err, res) {
      t.ok(_.isPlainObject(err), "is an object")

      t.ok( _.isUndefined(err.greeting1), "string passes")
      t.ok( _.isUndefined(err.greeting2), "string passes")
      t.ok( _.isUndefined(err.greeting3), "string passes")
      t.ok( _.isUndefined(err.greeting4), "string passes")
      t.ok( _.isUndefined(err.greetingA), "string passes")
      t.ok( _.isUndefined(err.greetingB), "string passes")

      t.ok( _.isUndefined(err.greeting5), "string passes")
      t.ok( _.isUndefined(err.greeting6), "string passes")
      t.ok( _.isUndefined(err.greeting7), "string passes")
      t.ok( _.isUndefined(err.greeting8), "string passes")
      t.ok( _.isUndefined(err.greetingC), "string passes")
      t.ok( _.isUndefined(err.greetingD), "string passes")

      t.equal(res.greeting1, 'Alright?', "greeting1 takes the incoming value")
      t.equal(res.greeting2, "G'Day", "greeting2 takes the incoming value")
      t.equal(res.greeting3, 'Yo!', "greeting3 takes the default value")
      t.equal(res.greeting4, 'Wassup', "greeting4 takes the default value")
      t.equal(res.greetingA, 'Cheers', "greetingA takes the default value")
      t.equal(res.greetingB, '', "greetingB takes the default value")

      t.equal(res.greeting5, 'Alright?', "greeting5 takes the incoming value")
      t.equal(res.greeting6, "G'Day", "greeting6 takes the incoming value")
      t.equal(res.greeting7, 'Yo!', "greeting7 takes the default value")
      t.equal(res.greeting8, 'Wassup', "greeting8 takes the default value")
      t.equal(res.greetingC, 'Cheers', "greetingC takes the default value")
      t.equal(res.greetingD, '', "greetingD takes the default value")

      t.end()
    },
  },

  {
    name : 'Convert strings to booleans, with defaults',
    schema : {
      tall1  : sound().isString().hasDefault('true').toBoolean(),
      small1 : sound().isString().hasDefault('on').toBoolean(),
      wide1  : sound().isString().hasDefault('0').toBoolean(),
      thin1  : sound().isString().hasDefault('f').toBoolean(),
      tall2  : sound().isString().hasDefault('true').toBoolean(),
      small2 : sound().isString().hasDefault('on').toBoolean(),
      wide2  : sound().isString().hasDefault('0').toBoolean(),
      thin2  : sound().isString().hasDefault('f').toBoolean(),
    },
    params : {
      tall1 : 'yes',
      small1 : "1",
      wide1 : 'OFF',
      thin1 : "no",
    },
    test : function(t, err, res) {
      t.ok(_.isPlainObject(err), "is an object")

      t.ok( _.isUndefined(err.tall1),  "string passes")
      t.ok( _.isUndefined(err.small1), "string passes")
      t.ok( _.isUndefined(err.wide1),  "string passes")
      t.ok( _.isUndefined(err.thin1),  "string passes")

      t.ok( _.isUndefined(err.tall2),  "string passes")
      t.ok( _.isUndefined(err.small2), "string passes")
      t.ok( _.isUndefined(err.wide2),  "string passes")
      t.ok( _.isUndefined(err.thin2),  "string passes")

      t.equal(res.tall1,  true,  "tall1 takes the incoming value")
      t.equal(res.small1, true,  "small1 takes the incoming value")
      t.equal(res.wide1,  false, "wide1 takes the incoming value")
      t.equal(res.thin1,  false, "thin1 takes the incoming value")

      t.equal(res.tall1,  true,  "greeting5 takes the default value")
      t.equal(res.small1, true,  "greeting6 takes the default value")
      t.equal(res.wide1,  false, "greeting7 takes the default value")
      t.equal(res.thin1,  false, "greeting8 takes the default value")

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
