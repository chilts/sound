var _ = require('underscore');
var test = require("tape");
var sound = require('../sound.js');

var schemaForStrings = {
    username1 : sound().isString().isRequired().setName('Username1'),
    username2 : sound().isString().isRequired().setName('Username2').isMinLen(3),
    username3 : sound().isString().isRequired().setName('Username3').isMinLen(3),
    username4 : sound().isString().isRequired().setName('Username4').isMaxLen(8),
    username5 : sound().isString().isRequired().setName('Username5').isMaxLen(8),
    username6 : sound().isString().isRequired().setName('Username6').isMinLen(3).isMaxLen(8),
    username7 : sound().isString().isRequired().setName('Username7').isMinLen(3).isMaxLen(8),
    username8 : sound().isString().isRequired().setName('Username8').isMaxLen(8).isMinLen(3),
    username9 : sound().isString().isRequired().setName('Username9').isMaxLen(8).isMinLen(3),
};

var schemaForIntegers = {
    int1 : sound().isInteger().isRequired().setName('Int1'),
    int2 : sound().isInteger().isRequired().setName('Int2').isMinVal(3),
    int3 : sound().isInteger().isRequired().setName('Int3').isMinVal(3),
    int4 : sound().isInteger().isRequired().setName('Int4').isMaxVal(8),
    int5 : sound().isInteger().isRequired().setName('Int5').isMaxVal(8),
    int6 : sound().isInteger().isRequired().setName('Int6').isMinVal(3).isMaxVal(8),
    int7 : sound().isInteger().isRequired().setName('Int7').isMinVal(3).isMaxVal(8),
    int8 : sound().isInteger().isRequired().setName('Int8').isMaxVal(8).isMinVal(3),
    int9 : sound().isInteger().isRequired().setName('Int9').isMaxVal(8).isMinVal(3),
    int10 : sound().isInteger().isRequired().setName('Int10').isGreaterThan(3),
    int11 : sound().isInteger().isRequired().setName('Int11').isGreaterThan(3),
    int12 : sound().isInteger().isRequired().setName('Int12').isLessThan(8),
    int13 : sound().isInteger().isRequired().setName('Int13').isLessThan(8),
};

var schemaForUrls = {
    url1 : sound().isString().isRequired().isUrl(),
    url2 : sound().isString().isRequired().isUrl(),
    url3 : sound().isString().isRequired().isUrl(),
    url4 : sound().isString().isRequired().isUrl(),
    url5 : sound().isString().isRequired().isUrl(),
    url6 : sound().isString().isRequired().isUrl(),
    url7 : sound().isString().isRequired().isUrl(),
};

var schemaForEmailAddresses = {
    email1 : sound().isString().isRequired().isEmailAddress(),
    email2 : sound().isString().isRequired().isEmailAddress(),
    email3 : sound().isString().isRequired().isEmailAddress(),
    email4 : sound().isString().isRequired().isEmailAddress(),
    email5 : sound().isString().isRequired().isEmailAddress(),
    email6 : sound().isString().isRequired().isEmailAddress(),
    email7 : sound().isString().isRequired().isEmailAddress(),
    email8 : sound().isString().isRequired().isEmailAddress(),
};

var schemaForTokens = {
    tok1 : sound().isString().isRequired().isToken(),
    tok2 : sound().isString().isRequired().isToken(),
    tok3 : sound().isString().isRequired().isToken(),
    tok4 : sound().isString().isRequired().isToken(),
    tok5 : sound().isString().isRequired().isToken(),
    tok6 : sound().isString().isRequired().isToken(),
    tok7 : sound().isString().isRequired().isToken(),
};

var schemaForUrlShortener = {
    title : sound().isString().isRequired(),
    url   : sound().isString().isRequired().isUrl(),
};

var schemaForMatches = {
    username : sound().isString().isRequired(),
    favColour1 : sound().isString().isMatch(/^(red|green|blue)$/),
    favColour2 : sound().isString().isMatch(/^(red|green|blue)$/),
};

var tests = [

    {
        name : 'Validate simple types (isRequired)',
        schema : {
            username : sound().isString().setName('Username').isRequired(),
            password : sound().isString().setName('Password').isRequired(),
            logins   : sound().isInteger().setName('Logins').isRequired(),
            pi       : sound().isFloat().setName('PI').isRequired(),
            isAdmin  : sound().isBoolean().setName('Is Admin').isRequired(),
            isHuman  : sound().isBoolean().setName('Is Human').isRequired(),
            date     : sound().isDate().setName('Date').isRequired(),
            agree    : sound().isEqual(true).setName('Agree'),
            hasHair  : sound().isEqual(false).setName('Have Hair?'),
            age      : sound().isEqual(21).setName('Is 21?'),
            yes      : sound().isEqual('yes'),
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
            email8 : 'me@t.123',
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
            t.ok(!_.isUndefined(err.email8), "email8 fails");

            t.ok(err.email1, "email1 should be an Email Address");
            t.ok(err.email8, "email8 should be an Email Address");

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
