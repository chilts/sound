var _ = require('underscore');
var test = require("tape");
var sound = require('../sound.js');

var conversionsForStrings = {
    username0 : sound.string().trim().required(),
    username1 : sound.string().trim().required().name('Username1'),
    username2 : sound.string().required().lowercase().name('Username2'),
    username3 : sound.string().required().replace('_', '-').name('Username3'),
    username4 : sound.string().trim().lowercase().required().replace(/_/g, '-').name('Username4'),
};

var tests = [

    {
        name : 'Some simple converstions on .string() types',
        schema : conversionsForStrings,
        params : {
            username0 : '    ',
            username1 : ' andy   ',
            username2 : 'ANDY',
            username3 : 'the_boss',
            username4 : 'the_BIG_boss   ',
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "err is an object");
            t.ok(_.isObject(res), "res is an object");

            t.ok(!_.isUndefined(err.username0), "string fails");
            t.ok(_.isUndefined(err.username1), "string passes");
            t.ok(_.isUndefined(err.username2), "string passes");
            t.ok(_.isUndefined(err.username3), "string passes");
            t.ok(_.isUndefined(err.username4), "string passes");

            t.equal(res.username0, '', 'username0 gets converted to the empty string');
            t.equal(res.username1, 'andy', 'username0 gets converted to the empty string');
            t.equal(res.username2, 'andy', 'username0 gets converted to the empty string');
            t.equal(res.username3, 'the-boss', 'username0 gets converted to the empty string');
            t.equal(res.username4, 'the-big-boss', 'username0 gets converted to the empty string');

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
