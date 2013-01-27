var _ = require('underscore');
var test = require("tape");
var sound = require('../sound.js');

var schemaForStrings = {
    username1 : sound.string().required().name('Username1'),
    username2 : sound.string().required().name('Username2').minLen(3),
    username3 : sound.string().required().name('Username3').minLen(3),
    username4 : sound.string().required().name('Username4').maxLen(8),
    username5 : sound.string().required().name('Username5').maxLen(8),
    username6 : sound.string().required().name('Username6').minLen(3).maxLen(8),
    username7 : sound.string().required().name('Username7').minLen(3).maxLen(8),
    username8 : sound.string().required().name('Username8').maxLen(8).minLen(3),
    username9 : sound.string().required().name('Username9').maxLen(8).minLen(3),
};

var schemaForIntegers = {
    int1 : sound.integer().required().name('Int1'),
    int2 : sound.integer().required().name('Int2').min(3),
    int3 : sound.integer().required().name('Int3').min(3),
    int4 : sound.integer().required().name('Int4').max(8),
    int5 : sound.integer().required().name('Int5').max(8),
    int6 : sound.integer().required().name('Int6').min(3).max(8),
    int7 : sound.integer().required().name('Int7').min(3).max(8),
    int8 : sound.integer().required().name('Int8').max(8).min(3),
    int9 : sound.integer().required().name('Int9').max(8).min(3),
};

var schemaForUrls = {
    url1 : sound.string().required().isUrl(),
    url2 : sound.string().required().isUrl(),
    url3 : sound.string().required().isUrl(),
    url4 : sound.string().required().isUrl(),
    url5 : sound.string().required().isUrl(),
};

var schemaForUrlShortener = {
    title : sound.string().required(),
    url   : sound.string().required().isUrl(),
};

var schemaForMatches = {
    username : sound.string().required(),
    favColour1 : sound.string().matches(/^(red|green|blue)$/),
    favColour2 : sound.string().matches(/^(red|green|blue)$/),
};

var tests = [

    {
        name : 'Validate simple types (required)',
        schema : {
            username : sound.string().name('Username').required(),
            password : sound.string().name('Password').required(),
            logins   : sound.integer().name('Logins').required(),
            pi       : sound.float().name('PI').required(),
            isAdmin  : sound.boolean().name('Is Admin').required(),
            isHuman  : sound.boolean().name('Is Human').required(),
            date     : sound.date().name('Date').required(),
        },
        params : {
            username : 'andy',
            password : 's3kr1t',
            logins   : 2,
            pi       : 3.14159,
            isAdmin  : false,
            isHuman  : true,
            date     : new Date(),
        },
        test : function(t, err) {
            t.ok(!_.isObject(err), "is not an object");
            t.ok(_.isUndefined(err), "is undefined");
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
        test : function(t, err) {
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
        },
        test : function(t, err) {
            console.log('----------------------------------------');
            console.log('err:', err);
            console.log('----------------------------------------');
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

            t.ok(err.int3, "int3 should be at least 3'");
            t.ok(err.int5, "int5 should be at most 8'");

            // for these, the first error should be these
            t.ok(err.int7, "int7 should be at least 3'");
            t.ok(err.int9, "int9 should be at most 8'");

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
        },
        test : function(t, err) {
            console.log('----------------------------------------');
            console.log('err:', err);
            console.log('----------------------------------------');
            t.ok(_.isObject(err), "is an object");
            t.ok( _.isUndefined(err.url1), "url1 passes");
            t.ok( _.isUndefined(err.url2), "url2 passes");
            t.ok( _.isUndefined(err.url3), "url3 passes");
            t.ok( _.isUndefined(err.url4), "url4 passes");
            t.ok(!_.isUndefined(err.url5), "url5 fails");

            t.ok(err.url5, "url5 should be a URL and start with http:// or https://");

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
        test : function(t, err) {
            console.log('----------------------------------------');
            console.log('err:', err);
            console.log('----------------------------------------');
            t.ok(!_.isObject(err), "is not an object");
            t.ok(_.isUndefined(err), "is undefined");

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
        test : function(t, err) {
            console.log('----------------------------------------');
            console.log('err:', err);
            console.log('----------------------------------------');
            t.ok(_.isObject(err), "is an object");

            t.ok( _.isUndefined(err.username), "username is correct");
            t.ok( _.isUndefined(err.favColour1), "red is ok");
            t.ok(!_.isUndefined(err.favColour2), "purple is not ok");

            t.ok(err.favColour2, "favColour2 does not validate");

            t.end();
        },
    },

];

console.log('1');
tests.forEach(function(v, i) {
    console.log('NEW TEST');
    test(v.name, function(t) {
        console.log('INSIDE TEST');
        var err = sound.validate(v.params, v.schema);
        v.test(t, err);
    });
    console.log('END OF TEST');
});
console.log('ENDED');

