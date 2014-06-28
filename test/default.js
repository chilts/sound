var _ = require('underscore');
var test = require("tape");
var sound = require('../sound.js');

var tests = [

    {
        name : 'Default simple strings (1)',
        schema : {
            greeting1 : sound().isString().default('hello'),
            greeting2 : sound().isString().default('hi'),
            greeting3 : sound().isString().default('Yo!'),
            greeting4 : sound().isString().default('Wassup'),

            greeting5 : sound().isString().default('hello').required(),
            greeting6 : sound().isString().default('hi').required(),
            greeting7 : sound().isString().default('Yo!').required(),
            greeting8 : sound().isString().default('Wassup').required(),
        },
        params : {
            greeting1 : 'Alright?',
            greeting2 : "G'Day",
            greeting5 : 'Alright?',
            greeting6 : "G'Day",
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "is an object");

            t.ok( _.isUndefined(err.greeting1), "string passes");
            t.ok( _.isUndefined(err.greeting2), "string passes");
            t.ok( _.isUndefined(err.greeting3), "string passes");
            t.ok( _.isUndefined(err.greeting4), "string passes");

            t.ok( _.isUndefined(err.greeting5), "string passes");
            t.ok( _.isUndefined(err.greeting6), "string passes");
            t.ok( _.isUndefined(err.greeting7), "string passes");
            t.ok( _.isUndefined(err.greeting8), "string passes");

            t.equal(res.greeting1, 'Alright?', "greeting1 takes the incoming value");
            t.equal(res.greeting2, "G'Day", "greeting2 takes the incoming value");
            t.equal(res.greeting3, 'Yo!', "greeting3 takes the default value");
            t.equal(res.greeting4, 'Wassup', "greeting4 takes the default value");

            t.equal(res.greeting5, 'Alright?', "greeting5 takes the incoming value");
            t.equal(res.greeting6, "G'Day", "greeting6 takes the incoming value");
            t.equal(res.greeting7, 'Yo!', "greeting7 takes the default value");
            t.equal(res.greeting8, 'Wassup', "greeting8 takes the default value");

            t.end();
        },
    },

    {
        name : 'Convert strings to booleans, with defaults',
        schema : {
            tall1  : sound().isString().default('true').toBoolean(),
            small1 : sound().isString().default('on').toBoolean(),
            wide1  : sound().isString().default('0').toBoolean(),
            thin1  : sound().isString().default('f').toBoolean(),
            tall2  : sound().isString().default('true').toBoolean(),
            small2 : sound().isString().default('on').toBoolean(),
            wide2  : sound().isString().default('0').toBoolean(),
            thin2  : sound().isString().default('f').toBoolean(),
        },
        params : {
            tall1 : 'yes',
            small1 : "1",
            wide1 : 'OFF',
            thin1 : "no",
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "is an object");

            t.ok( _.isUndefined(err.tall1),  "string passes");
            t.ok( _.isUndefined(err.small1), "string passes");
            t.ok( _.isUndefined(err.wide1),  "string passes");
            t.ok( _.isUndefined(err.thin1),  "string passes");

            t.ok( _.isUndefined(err.tall2),  "string passes");
            t.ok( _.isUndefined(err.small2), "string passes");
            t.ok( _.isUndefined(err.wide2),  "string passes");
            t.ok( _.isUndefined(err.thin2),  "string passes");

            t.equal(res.tall1,  true,  "tall1 takes the incoming value");
            t.equal(res.small1, true,  "small1 takes the incoming value");
            t.equal(res.wide1,  false, "wide1 takes the incoming value");
            t.equal(res.thin1,  false, "thin1 takes the incoming value");

            t.equal(res.tall1,  true,  "greeting5 takes the default value");
            t.equal(res.small1, true,  "greeting6 takes the default value");
            t.equal(res.wide1,  false, "greeting7 takes the default value");
            t.equal(res.thin1,  false, "greeting8 takes the default value");

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
