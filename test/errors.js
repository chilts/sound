var _ = require('underscore');
var test = require("tape");
var sound = require('../sound.js');

var requiredSchema = {
    username : sound().isString().isRequired('a'),
    logins   : sound().isInteger().isRequired('b'),
    isHuman  : sound().isBoolean().isRequired('c'),
    pi       : sound().isFloat().isRequired('d'),
    col1     : sound().isString().isRequired('e').isEnum([ 'red', 'green', 'blue' ]),
    col2     : sound().isString().isRequired('f').isEnum([ 'red', 'green', 'blue' ]),
};

var errorsSchema = {
    username1 : sound().isString().isRequired().toLowerCase().isMatch(/^[a-z][a-z0-9-]{3,}$/, 'Username should only contain letters, numbers and the dash character.'),
    username2 : sound().isString().isRequired().isMinLen(3, 'Username must be at least 3 characters long'),
    username3 : sound().isString().isRequired().isMaxLen(8, 'Must be shorter than 8 chars.'),
    username4 : sound().isString().isRequired().isMaxLen(8, 'Must be shorter than 8 chars.'),
    col1      : sound().isString().isEnum([ 'red', 'green', 'blue' ], "Must be one of 'red', 'green', or 'blue'."),
    col2      : sound().isString().isEnum([ 'red', 'green', 'blue' ], "Must be one of 'red', 'green', or 'blue'."),
};

var tests = [

    {
        name : "Error messages if .isRequired() isn't fulfilled",
        schema : requiredSchema,
        params : {
            col2: '',
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "err is an object");
            t.ok(_.isObject(res), "res is an object");

            t.ok(!_.isUndefined(err.username), "username fails");
            t.ok(!_.isUndefined(err.logins), "logins fails");
            t.ok(!_.isUndefined(err.isHuman), "isHuman fails");
            t.ok(!_.isUndefined(err.pi), "pi fails");
            t.ok(!_.isUndefined(err.col1), "col1 fails");
            t.ok(!_.isUndefined(err.col2), "col2 fails");

            t.equal(err.username, 'a', 'username .isRequired() message is correct');
            t.equal(err.logins, 'b', 'logins .isRequired() message is correct');
            t.equal(err.isHuman, 'c', 'isHuman .isRequired() message is correct');
            t.equal(err.pi, 'd', 'pi .isRequired() message is correct');
            t.equal(err.col1, 'e', 'col1 .isRequired() message is correct');
            t.equal(err.col2, 'f', 'col2 .isRequired() message is correct');

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
            col1      : 'purple',
            col2      : ' ',
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "err is an object");
            t.ok(_.isObject(res), "res is an object");

            t.ok(!_.isUndefined(err.username1), "username1 fails");
            t.ok(!_.isUndefined(err.username2), "username2 fails");
            t.ok(!_.isUndefined(err.username3), "username3 fails");
            t.ok( _.isUndefined(err.username4), "username4 is ok");
            t.ok(!_.isUndefined(err.col1), "col1 fails");
            t.ok(!_.isUndefined(err.col2), "col2 fails");

            t.equal(err.username1, 'Username should only contain letters, numbers and the dash character.', 'username1 error is correct');
            t.equal(err.username2, 'Username must be at least 3 characters long', 'username2 error is correct');
            t.equal(err.username3, 'Must be shorter than 8 chars.', 'username3 error is correct');
            t.equal(err.col1, "Must be one of 'red', 'green', or 'blue'.", 'col1 error is correct');
            t.equal(err.col2, "Must be one of 'red', 'green', or 'blue'.", 'col2 error is correct');

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
