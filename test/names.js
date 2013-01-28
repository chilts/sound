var _ = require('underscore');
var test = require("tape");
var sound = require('../sound.js');

var namesSchema = {
    username : sound.string().required().name('Username'),
    password : sound.string().required().name('Password').minLen(8),
    numOfCars : sound.integer().required().name('Cars Owned').min(0),
    pi : sound.float().required().name('PI'),
    happy : sound.boolean().required().name("'Are you happy?'"),
};

var tests = [

    {
        name : 'Names for each parameter',
        schema : namesSchema,
        params : {
            username : '',
            password : '123456',
            numOfCars : -1,
            pi : undefined,
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
            t.equal(err.pi, 'PI should be of type float', 'pi message is correct');
            t.equal(err.happy, "'Are you happy?' should be of type boolean", 'happy message is correct');

            t.end();
        },
    },

];

tests.forEach(function(v, i) {
    test(v.name, function(t) {
        sound.validate(v.params, v.schema, function(err, res) {
            v.test(t, err, res);
        });
    });
});
