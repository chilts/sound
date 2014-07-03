var _ = require('underscore');
var test = require("tape");
var sound = require('../sound.js');

var schemaForStrings = {
    username1 : sound().isString().required().name('Username1'),
    username2 : sound().isString().required().name('Username2').minLen(3),
    username3 : sound().isString().required().name('Username3').minLen(3),
    username4 : sound().isString().required().name('Username4').maxLen(8),
    username5 : sound().isString().required().name('Username5').maxLen(8),
    username6 : sound().isString().required().name('Username6').minLen(3).maxLen(8),
    username7 : sound().isString().required().name('Username7').minLen(3).maxLen(8),
    username8 : sound().isString().required().name('Username8').maxLen(8).minLen(3),
    username9 : sound().isString().required().name('Username9').maxLen(8).minLen(3),
};

var schemaForIntegers = {
    int1 : sound().isInteger().required().name('Int1'),
    int2 : sound().isInteger().required().name('Int2').min(3),
    int3 : sound().isInteger().required().name('Int3').min(3),
    int4 : sound().isInteger().required().name('Int4').max(8),
    int5 : sound().isInteger().required().name('Int5').max(8),
    int6 : sound().isInteger().required().name('Int6').min(3).max(8),
    int7 : sound().isInteger().required().name('Int7').min(3).max(8),
    int8 : sound().isInteger().required().name('Int8').max(8).min(3),
    int9 : sound().isInteger().required().name('Int9').max(8).min(3),
    int10 : sound().isInteger().required().name('Int10').gt(3),
    int11 : sound().isInteger().required().name('Int11').gt(3),
    int12 : sound().isInteger().required().name('Int12').lt(8),
    int13 : sound().isInteger().required().name('Int13').lt(8),
};

var schemaForUrls = {
    url1 : sound().isString().required().isUrl(),
    url2 : sound().isString().required().isUrl(),
    url3 : sound().isString().required().isUrl(),
    url4 : sound().isString().required().isUrl(),
    url5 : sound().isString().required().isUrl(),
    url6 : sound().isString().required().isUrl(),
    url7 : sound().isString().required().isUrl(),
};

var schemaForEmailAddresses = {
    email1 : sound().isString().required().isEmailAddress(),
    email2 : sound().isString().required().isEmailAddress(),
    email3 : sound().isString().required().isEmailAddress(),
    email4 : sound().isString().required().isEmailAddress(),
    email5 : sound().isString().required().isEmailAddress(),
    email6 : sound().isString().required().isEmailAddress(),
    email7 : sound().isString().required().isEmailAddress(),
};

var schemaForTokens = {
    tok1 : sound().isString().required().isToken(),
    tok2 : sound().isString().required().isToken(),
    tok3 : sound().isString().required().isToken(),
    tok4 : sound().isString().required().isToken(),
    tok5 : sound().isString().required().isToken(),
    tok6 : sound().isString().required().isToken(),
    tok7 : sound().isString().required().isToken(),
};

var schemaForUrlShortener = {
    title : sound().isString().required(),
    url   : sound().isString().required().isUrl(),
};

var schemaForMatches = {
    username : sound().isString().required(),
    favColour1 : sound().isString().matches(/^(red|green|blue)$/),
    favColour2 : sound().isString().matches(/^(red|green|blue)$/),
};

var tests = [

    {
        name : 'Validate simple types (required)',
        schema : {
            username : sound().isString().name('Username').required(),
            password : sound().isString().name('Password').required(),
            logins   : sound().isInteger().name('Logins').required(),
            pi       : sound().isFloat().name('PI').required(),
            isAdmin  : sound().isBoolean().name('Is Admin').required(),
            isHuman  : sound().isBoolean().name('Is Human').required(),
            date     : sound().isDate().name('Date').required(),
            agree    : sound().is(true).name('Agree'),
            hasHair  : sound().is(false).name('Have Hair?'),
            age      : sound().is(21).name('Is 21?'),
            yes      : sound().is('yes'),
        },
        params : {
            username : 'andy',
            password : 's3kr1t',
            logins   : 2,
            pi       : 3.14159,
            isAdmin  : false,
            isHuman  : true,
            date     : new Date(),
            agree    : true,
            hasHair  : false,
            age      : 21,
            yes      : 'yes',
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "is an object");
            t.end();
        },
    },

    {
        name : 'Min/Max Lengths of strings',
        schema : schemaForStrings,
        params : {
            username1 : 'ok',
            username2 : 'ok-here',
            username3 : 'mm',
            username4 : 'ok-here',
            username5 : 'too-long-here',
            username6 : 'ok-here',
            username7 : 'mm',
            username8 : 'ok-here',
            username9 : 'too-long-here',
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "is an object");
            t.ok( _.isUndefined(err.username1), "string passes");
            t.ok( _.isUndefined(err.username2), "string passes");
            t.ok(!_.isUndefined(err.username3), "string passes");
            t.ok( _.isUndefined(err.username4), "string passes");
            t.ok(!_.isUndefined(err.username5), "string passes");
            t.ok( _.isUndefined(err.username6), "string passes");
            t.ok(!_.isUndefined(err.username7), "string passes");
            t.ok( _.isUndefined(err.username8), "string passes");
            t.ok(!_.isUndefined(err.username9), "string passes");

            t.ok(err.username3, "username3 should be at least 3 characters'");
            t.ok(err.username5, "username5 should be at most 8 characters'");

            // for these, the first error should be these
            t.ok(err.username7, "username7 should be at least 3 characters'");
            t.ok(err.username9, "username9 should be at most 8 characters'");

            t.end();
        },
    },

    {
        name : 'Min/Max for integers',
        schema : schemaForIntegers,
        params : {
            int1 : 5,
            int2 : 5,
            int3 : 2,
            int4 : 5,
            int5 : 9,
            int6 : 5,
            int7 : 2,
            int8 : 5,
            int9 : 9,
            int10 : 4,
            int11 : 3,
            int12 : 7,
            int13 : 8,
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "is an object");
            t.ok( _.isUndefined(err.int1), "integer passes");
            t.ok( _.isUndefined(err.int2), "integer passes");
            t.ok(!_.isUndefined(err.int3), "integer passes");
            t.ok( _.isUndefined(err.int4), "integer passes");
            t.ok(!_.isUndefined(err.int5), "integer passes");
            t.ok( _.isUndefined(err.int6), "integer passes");
            t.ok(!_.isUndefined(err.int7), "integer passes");
            t.ok( _.isUndefined(err.int8), "integer passes");
            t.ok(!_.isUndefined(err.int9), "integer passes");
            t.ok( _.isUndefined(err.int10), "integer passes");
            t.ok(!_.isUndefined(err.int11), "integer passes");
            t.ok( _.isUndefined(err.int12), "integer passes");
            t.ok(!_.isUndefined(err.int13), "integer passes");

            t.ok(err.int3, "int3 should be at least 3'");
            t.ok(err.int5, "int5 should be at most 8'");

            // for these, the first error should be these
            t.ok(err.int7, "int7 should be at least 3'");
            t.ok(err.int9, "int9 should be at most 8'");

            // for these, the first error should be these
            t.ok(err.int11, "int11 should be greater than 4'");
            t.ok(err.int13, "int13 should be less than 8'");

            t.end();
        },
    },

    {
        name : 'URLs',
        schema : schemaForUrls,
        params : {
            url1 : 'http://chilts.org/',
            url2 : 'http://chilts.org',
            url3 : 'http://chilts.org/blog/',
            url4 : 'https://google.com/',
            url5 : 'ftp://example.net/',
            url6 : 'http://localhost/',
            url7 : 'http://localhost.localdomain:8000/',
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "is an object");
            t.ok( _.isUndefined(err.url1), "url1 passes");
            t.ok( _.isUndefined(err.url2), "url2 passes");
            t.ok( _.isUndefined(err.url3), "url3 passes");
            t.ok( _.isUndefined(err.url4), "url4 passes");
            t.ok(!_.isUndefined(err.url5), "url5 fails");
            t.ok(!_.isUndefined(err.url6), "url6 fails"); // 'coz we want domain names
            t.ok( _.isUndefined(err.url7), "url7 passes");

            t.ok(err.url5, "url5 should be a URL and start with http:// or https://");

            t.end();
        },
    },

    {
        name : 'Email Addresses',
        schema : schemaForEmailAddresses,
        params : {
            email1 : '',
            email2 : '@',
            email3 : 'blah',
            email4 : '1@2.de',
            email5 : 'andychilton+tagged@gmail.com',
            email6 : 'mchu4apc@fs2.ee.umist.ac.uk',
            email7 : 'me@t.co',
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "is an object");
            t.ok(!_.isUndefined(err.email1), "email1 fails");
            t.ok(!_.isUndefined(err.email2), "email2 fails");
            t.ok(!_.isUndefined(err.email3), "email3 fails");
            t.ok( _.isUndefined(err.email4), "email4 passes");
            t.ok( _.isUndefined(err.email5), "email5 passes");
            t.ok( _.isUndefined(err.email6), "email6 passes");
            t.ok( _.isUndefined(err.email7), "email7 passes");

            t.ok(err.email1, "email1 should be an Email Address");

            t.end();
        },
    },

    {
        name : 'Tokens',
        schema : schemaForTokens,
        params : {
            tok1 : 'chilts',
            tok2 : 'yay-pie',
            tok3 : '-invalid',
            tok4 : 'invalid-',
            tok5 : 'contains spaces',
            tok6 : 'AndyUppercase',
            tok7 : '*&%@#&',
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "is an object");
            t.ok( _.isUndefined(err.tok1), "tok1 passes");
            t.ok( _.isUndefined(err.tok2), "tok2 passes");
            t.ok(!_.isUndefined(err.tok3), "tok3 fails");
            t.ok(!_.isUndefined(err.tok4), "tok4 fails");
            t.ok(!_.isUndefined(err.tok5), "tok5 fails");
            t.ok(!_.isUndefined(err.tok6), "tok6 fails");
            t.ok(!_.isUndefined(err.tok7), "tok7 fails");

            t.ok(err.tok3, "tok3 should start and end with letters/numbers and contain only lowercase letters, numbers and dashes");

            t.end();
        },
    },

    {
        name : 'Url Shortener',
        schema : schemaForUrlShortener,
        params : {
            title : 'chilts.org',
            url   : 'http://chilts.org/',
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "is an object");

            t.end();
        },
    },

    {
        name : 'Test for .matches()',
        schema : schemaForMatches,
        params : {
            username : 'chilts',
            favColour1 : 'red',
            favColour2 : 'purple',
        },
        test : function(t, err, res) {
            t.ok(_.isObject(err), "is an object");

            t.ok( _.isUndefined(err.username), "username is correct");
            t.ok( _.isUndefined(err.favColour1), "red is ok");
            t.ok(!_.isUndefined(err.favColour2), "purple is not ok");

            t.ok(err.favColour2, "favColour2 does not validate");

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
