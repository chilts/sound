var _ = require('underscore');
var test = require("tape");
var sound = require('../sound.js');

var coercionsForStrings = {
    percentage0 : sound().isString().trim().required().matches(/^\d+$/).toInteger().min(0).max(100),
    percentage1 : sound().isString().trim().required().matches(/^\d+$/).toInteger().min(0).max(100),
    percentage2 : sound().isString().trim().required().matches(/^\d+$/).toInteger().min(0).max(100),
    percentage3 : sound().isString().trim().required().matches(/^\d+$/).toInteger().min(0).max(100),
    percentage4 : sound().isString().trim().required().matches(/^\d+$/).toInteger().min(0).max(100),
};

var coercionsToBooleans = {
    bool0 : sound().isInteger().toBoolean(),
    bool1 : sound().isInteger().toBoolean(),
    bool2 : sound().isString().trim().toBoolean(),
    bool3 : sound().isString().trim().toBoolean(),
    bool4 : sound().isString().trim().toBoolean(),
    bool5 : sound().isString().trim().toBoolean(),
    bool6 : sound().isString().trim().toBoolean(),
    bool7 : sound().isString().trim().toBoolean(),
    bool8 : sound().isString().trim().toBoolean(),
    bool9 : sound().isString().trim().toBoolean(),
    bool10 : sound().isString().trim().toBoolean(),
};

var tests = [

    {
        name : 'Coercions for Strings to Integers',
        schema : coercionsForStrings,
        params : {
            percentage0 : '-1',
            percentage1 : ' 0 ',
            percentage2 : ' 100 ',
            percentage3 : '101',
            percentage4 : '1.1',
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "err is an object");
            t.ok(_.isObject(res), "res is an object");

            t.ok(!_.isUndefined(err.percentage0), "-1 fails the regex");
            t.ok(_.isUndefined(err.percentage1), "0 is ok");
            t.ok(_.isUndefined(err.percentage2), "100 is ok");
            t.ok(!_.isUndefined(err.percentage3), "101 is too high");
            t.ok(!_.isUndefined(err.percentage4), "1.1 fails the regex");

            t.equal(res.percentage0, '-1', 'percentage0 does not get converted');
            t.equal(res.percentage1, 0, 'percentage1 gets converted to an integer');
            t.equal(res.percentage2, 100, 'percentage2 gets converted to an integer');
            t.equal(res.percentage3, 101, 'percentage3 gets converted to an integer');
            t.equal(res.percentage4, '1.1', 'percentage4 does not get converted');

            t.end();
        },
    },

    {
        name : 'Coercions for Strings to Booleans',
        schema : coercionsToBooleans,
        params : {
            bool0 : 0,
            bool1 : 1,
            bool2 : '0',
            bool3 : '1',
            bool4 : 'FALSE',
            bool5 : 'true',
            bool6 : ' No ',
            bool7 : 'yes ',
            bool8 : 'OFF',
            bool9 : ' On ',
            bool10 : 'invalid',
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "err is an object");
            t.ok(_.isObject(res), "res is an object");

            t.ok( _.isUndefined(err.bool0), "0 is ok");
            t.ok( _.isUndefined(err.bool1), "1 is ok");
            t.ok( _.isUndefined(err.bool2), "'0' is ok");
            t.ok( _.isUndefined(err.bool3), "'1' is ok");
            t.ok( _.isUndefined(err.bool4), "true is ok");
            t.ok( _.isUndefined(err.bool5), "false is ok");
            t.ok( _.isUndefined(err.bool6), "yes is ok");
            t.ok( _.isUndefined(err.bool7), "no is ok");
            t.ok( _.isUndefined(err.bool8), "on is ok");
            t.ok( _.isUndefined(err.bool9), "off is ok");
            t.ok(!_.isUndefined(err.bool10), "invalid fails");

            t.equal(res.bool0, false, 'bool0');
            t.equal(res.bool1, true,  'bool1');
            t.equal(res.bool2, false, 'bool2');
            t.equal(res.bool3, true,  'bool3');
            t.equal(res.bool4, false, 'bool4');
            t.equal(res.bool5, true,  'bool5');
            t.equal(res.bool6, false, 'bool6');
            t.equal(res.bool7, true,  'bool7');
            t.equal(res.bool8, false, 'bool8');
            t.equal(res.bool9, true,  'bool9');
            t.equal(res.bool10, 'invalid', 'bool10');

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
