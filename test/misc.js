var _ = require('underscore');
var test = require("tape");
var sound = require('../sound.js');

var signup = {
    username : sound().isString('letters and numbers only').lowercase().trim().required().isToken().minLen(3),
    email    : sound().isString('should be an email address').trim().isEmailAddress(),
    password : sound().isString('use at least 8 chars').required().minLen(8).maxLen(100),
};

var tests = [

    {
        name : 'Validate username, email and password',
        schema : signup,
        params : {
            username : '  Andy  ',
            password : 's3kr1ts3kr1t',
            email    : 'me@example.com',
        },
        test : function(t, res) {
            t.ok(_.isObject(res.err), "is an object");

            t.equal(res.ok, true, 'Sign up passes');

            t.equal(res.val.username, 'andy', 'username has been trimmed and lowercased');
            t.equal(res.val.password, 's3kr1ts3kr1t', 'password is intact');
            t.equal(res.val.email, 'me@example.com', 'email is the same');

            t.equal(res.arg.username, '  Andy  ', 'username is the same');
            t.equal(res.arg.password, 's3kr1ts3kr1t', 'password is intact');
            t.equal(res.arg.email, 'me@example.com', 'email is still the same');

            t.end();
        },
    },

    {
        name : 'Validate username, password no email',
        schema : signup,
        params : {
            username : '  Andy  ',
            password : 's3kr1ts3kr1t',
            email    : '',
        },
        test : function(t, res) {
            t.ok(_.isObject(res.err), "is an object");

            t.equal(res.ok, true, 'Sign up passes');

            t.equal(res.val.username, 'andy', 'username has been trimmed and lowercased');
            t.equal(res.val.password, 's3kr1ts3kr1t', 'password is intact');
            t.equal(res.val.email, undefined, 'email is undefined');

            t.equal(res.arg.username, '  Andy  ', 'username is the same');
            t.equal(res.arg.password, 's3kr1ts3kr1t', 'password is intact');
            t.equal(res.arg.email, '', 'email is still an empty string');

            t.end();
        },
    },

];

tests.forEach(function(v, i) {
    test(v.name, function(t) {
        var res = sound.validate(v.params, v.schema);
        v.test(t, res);
    });
});
