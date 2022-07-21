import _ from 'lodash'
import test from 'tape'
import sound from '../sound.js'

// two different ways of specifying the name of the parameter

const namesSchema1 = {
  username  : sound().isString().isRequired().setName('Username').isMinLen(4),
  password  : sound().isString().isRequired().setName('Password').isMinLen(8),
  numOfCars : sound().isInteger().isRequired().setName('Cars Owned').isMinVal(0),
  pi        : sound().isFloat().isRequired().setName('PI'),
  happy     : sound().isBoolean().isRequired().setName("Happy"),
  col       : sound().isString().isRequired().setName("Colour").isEnum([ 'red', 'green', 'blue' ]),
}

const namesSchema2 = {
  username  : sound('Username').isString().isRequired().isMinLen(4),
  password  : sound('Password').isString().isRequired().isMinLen(8),
  numOfCars : sound('Cars Owned').isInteger().isRequired().isMinVal(0),
  pi        : sound('PI').isFloat().isRequired(),
  happy     : sound("Happy").isBoolean().isRequired(),
  col       : sound("Colour").isString().isRequired().isEnum([ 'red', 'green', 'blue' ]),
}

const tests = [

  {
    name : 'Names for each parameter, required',
    schema : namesSchema1,
    params : {},
    test : function(t, err, res) {
      t.ok(_.isPlainObject(err), "err is an object")
      t.ok(_.isPlainObject(res), "res is an object")

      t.ok(!_.isUndefined(err.username), "username fails")
      t.ok(!_.isUndefined(err.password), "password fails")
      t.ok(!_.isUndefined(err.numOfCars), "numOfCars fails")
      t.ok(!_.isUndefined(err.pi), "pi fails")
      t.ok(!_.isUndefined(err.happy), "happy fails")
      t.ok(!_.isUndefined(err.col), "col fails")

      t.equal(err.username, 'Username is required', 'Username error is correct')
      t.equal(err.password, 'Password is required', 'password error is correct')
      t.equal(err.numOfCars, 'Cars Owned is required', 'numOfCars error is correct')
      t.equal(err.pi, 'PI is required', 'pi error is correct')
      t.equal(err.happy, "Happy is required", 'happy error is correct')
      t.equal(err.col, "Colour is required", 'col error is correct')

      t.end()
    },
  },

  {
    name : 'Names for each parameter',
    schema : namesSchema1,
    params : {
      username : undefined,
      password : '123456',
      numOfCars : -1,
      pi : 'float',
      happy : 'Yes',
      col : 'purple',
    },
    test : function(t, err, res) {
      t.ok(_.isPlainObject(err), "err is an object")
      t.ok(_.isPlainObject(res), "res is an object")

      t.ok(!_.isUndefined(err.username), "username fails")
      t.ok(!_.isUndefined(err.password), "password fails")
      t.ok(!_.isUndefined(err.numOfCars), "numOfCars fails")
      t.ok(!_.isUndefined(err.pi), "pi fails")
      t.ok(!_.isUndefined(err.happy), "happy fails")
      t.ok(!_.isUndefined(err.col), "col fails")

      t.equal(err.username, 'Username is required', 'Username error is correct')
      t.equal(err.password, 'Password should be at least 8 characters', 'password error is correct')
      t.equal(err.numOfCars, 'Cars Owned should be at least 0', 'numOfCars error is correct')
      t.equal(err.pi, 'PI should be a float', 'pi error is correct')
      t.equal(err.happy, "Happy should be a boolean", 'happy error is correct')
      t.equal(err.col, "Colour is not a valid value", 'col error is correct')

      t.end()
    },
  },

  {
    name : 'Names for each parameter',
    schema : namesSchema2,
    params : {
      username : undefined,
      password : '123456',
      numOfCars : -1,
      pi : 'float',
      happy : 'Yes',
      col : 'purple',
    },
    test : function(t, err, res) {
      t.ok(_.isPlainObject(err), "err is an object")
      t.ok(_.isPlainObject(res), "res is an object")

      t.ok(!_.isUndefined(err.username), "username fails")
      t.ok(!_.isUndefined(err.password), "password fails")
      t.ok(!_.isUndefined(err.numOfCars), "numOfCars fails")
      t.ok(!_.isUndefined(err.pi), "pi fails")
      t.ok(!_.isUndefined(err.happy), "happy fails")
      t.ok(!_.isUndefined(err.col), "col fails")

      t.equal(err.username, 'Username is required', 'Username error is correct')
      t.equal(err.password, 'Password should be at least 8 characters', 'password error is correct')
      t.equal(err.numOfCars, 'Cars Owned should be at least 0', 'numOfCars error is correct')
      t.equal(err.pi, 'PI should be a float', 'pi error is correct')
      t.equal(err.happy, "Happy should be a boolean", 'happy error is correct')
      t.equal(err.col, "Colour is not a valid value", 'col error is correct')

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
