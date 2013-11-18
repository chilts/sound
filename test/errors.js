var _ = require('underscore');
var test = require("tape");
var sound = require('../sound.js');

var requiredSchema = {
    username : sound().isString().required('a'),
    logins   : sound().isInteger().required('b'),
    isHuman  : sound().isBoolean().required('c'),
    pi       : sound().isFloat().required('d'),
};

var errorsSchema = {
    username1 : sound().isString().required().lowercase().matches(/^[a-z][a-z0-9-]{3,}$/, 'Username should only contain letters, numbers and the dash character.'),
    username2 : sound().isString().required().minLen(3, 'Username must be at least 3 characters long'),
    username3 : sound().isString().required().maxLen(8, 'Must be shorter than 8 chars.'),
    username4 : sound().isString().required().maxLen(8, 'Must be shorter than 8 chars.'),
};

var tests = [

    {
        name : "Error messages if .required() isn't fulfilled",
        schema : requiredSchema,
        params : {},
        test : function(t, err, res) {
            t.ok(_.isObject(err), "err is an object");
            t.ok(_.isObject(res), "res is an object");

            t.ok(!_.isUndefined(err.username), "username fails");
            t.ok(!_.isUndefined(err.logins), "logins fails");
            t.ok(!_.isUndefined(err.isHuman), "isHuman fails");
            t.ok(!_.isUndefined(err.pi), "pi fails");

            t.equal(err.username, 'a', 'username .required() message is correct');
            t.equal(err.logins, 'b', 'logins .required() message is correct');
            t.equal(err.isHuman, 'c', 'isHuman .required() message is correct');
            t.equal(err.pi, 'd', 'pi .required() message is correct');

            t.end();
        },
    },

    {
        name : 'Error message from various validation functions',
        schema : errorsSchema,
        params : {
            username1 : 'Invalid!',
            username2 : 'hm',
            username3 : '1234567890',
            username4 : '12345678',
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "err is an object");
            t.ok(_.isObject(res), "res is an object");

            t.ok(!_.isUndefined(err.username1), "username1 fails");
            t.ok(!_.isUndefined(err.username2), "username2 fails");
            t.ok(!_.isUndefined(err.username3), "username3 fails");
            t.ok( _.isUndefined(err.username4), "username4 is ok");

            t.equal(err.username1, 'Username should only contain letters, numbers and the dash character.', 'username1 message is correct');
            t.equal(err.username2, 'Username must be at least 3 characters long', 'username2 has correct message');
            t.equal(err.username3, 'Must be shorter than 8 chars.', 'username3 message is correct');

            t.end();
        },
    },

];

tests.forEach(function(v, i) {
    test(v.name, function(t) {
        var res = sound.validate(v.params, v.schema);
        v.test(t, res.err, res.vals);
    });
});
