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

];

tests.forEach(function(v, i) {
    test(v.name, function(t) {
        sound.validate(v.params, v.schema, function(err, res) {
            v.test(t, err, res);
        });
    });
});
