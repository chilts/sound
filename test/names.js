var _ = require('underscore');
var test = require("tape");
var sound = require('../sound.js');

// two different ways of specifying the name of the parameter

var namesSchema1 = {
    username  : sound().isString().isRequired().setName('Username').isMinLen(4),
    password  : sound().isString().isRequired().setName('Password').isMinLen(8),
    numOfCars : sound().isInteger().isRequired().setName('Cars Owned').isMinVal(0),
    pi        : sound().isFloat().isRequired().setName('PI'),
    happy     : sound().isBoolean().isRequired().setName("'Are you happy?'"),
};

var namesSchema2 = {
    username  : sound('Username').isString().isRequired().isMinLen(4),
    password  : sound('Password').isString().isRequired().isMinLen(8),
    numOfCars : sound('Cars Owned').isInteger().isRequired().isMinVal(0),
    pi        : sound('PI').isFloat().isRequired(),
    happy     : sound("'Are you happy?'").isBoolean().isRequired(),
};

var tests = [

    {
        name : 'Names for each parameter',
        schema : namesSchema1,
        params : {
            username : undefined,
            password : '123456',
            numOfCars : -1,
            pi : 'float',
            happy : 'Yes',
        },
        test : function(t, err, res) {
            console.log(err, res);
            t.ok(_.isObject(err), "err is an object");
            t.ok(_.isObject(res), "res is an object");

            t.ok(!_.isUndefined(err.username), "username fails");
            t.ok(!_.isUndefined(err.password), "password fails");
            t.ok(!_.isUndefined(err.numOfCars), "numOfCars fails");
            t.ok(!_.isUndefined(err.pi), "pi fails");
            t.ok(!_.isUndefined(err.happy), "happy fails");

            t.equal(err.username, 'Username is required', 'Username message is correct');
            t.equal(err.password, 'Password should be at least 8 characters', 'password message is correct');
            t.equal(err.numOfCars, 'Cars Owned should be at least 0', 'numOfCars message is correct');
            t.equal(err.pi, 'PI should be a float', 'pi message is correct');
            t.equal(err.happy, "'Are you happy?' should be a boolean", 'happy message is correct');

            t.end();
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
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "err is an object");
            t.ok(_.isObject(res), "res is an object");

            t.ok(!_.isUndefined(err.username), "username fails");
            t.ok(!_.isUndefined(err.password), "password fails");
            t.ok(!_.isUndefined(err.numOfCars), "numOfCars fails");
            t.ok(!_.isUndefined(err.pi), "pi fails");
            t.ok(!_.isUndefined(err.happy), "happy fails");

            t.equal(err.username, 'Username is required', 'Username message is correct');
            t.equal(err.password, 'Password should be at least 8 characters', 'password message is correct');
            t.equal(err.numOfCars, 'Cars Owned should be at least 0', 'numOfCars message is correct');
            t.equal(err.pi, 'PI should be a float', 'pi message is correct');
            t.equal(err.happy, "'Are you happy?' should be a boolean", 'happy message is correct');

            t.end();
        },
    },

];

tests.forEach(function(v, i) {
    test(v.name, function(t) {
        var res = sound.validate(v.params, v.schema);
        v.test(t, res.err, res.val);
    });
});
