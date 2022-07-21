import _ from 'lodash'
import test from 'tape'
import sound from '../sound.js'

const schemaForStrings = {
  username1 : sound().isString().isRequired().setName('Username1'),
  username2 : sound().isString().isRequired().setName('Username2').isMinLen(3),
  username3 : sound().isString().isRequired().setName('Username3').isMinLen(3),
  username4 : sound().isString().isRequired().setName('Username4').isMaxLen(8),
  username5 : sound().isString().isRequired().setName('Username5').isMaxLen(8),
  username6 : sound().isString().isRequired().setName('Username6').isMinLen(3).isMaxLen(8),
  username7 : sound().isString().isRequired().setName('Username7').isMinLen(3).isMaxLen(8),
  username8 : sound().isString().isRequired().setName('Username8').isMaxLen(8).isMinLen(3),
  username9 : sound().isString().isRequired().setName('Username9').isMaxLen(8).isMinLen(3),
  usernameA : sound().isString().isRequired().isNotEmpty().setName('UsernameA'),
}

const schemaForIntegers = {
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
}

const schemaForUrls = {
  url1 : sound().isString().isRequired().isUrl(),
  url2 : sound().isString().isRequired().isUrl(),
  url3 : sound().isString().isRequired().isUrl(),
  url4 : sound().isString().isRequired().isUrl(),
  url5 : sound().isString().isRequired().isUrl(),
  url6 : sound().isString().isRequired().isUrl(),
  url7 : sound().isString().isRequired().isUrl(),
}

const schemaForDomains = {
  domain1 : sound().isString().isRequired().isDomain(),
  domain2 : sound().isString().isRequired().isDomain(),
  domain3 : sound().isString().isRequired().isDomain(),
  domain4 : sound().isString().isRequired().isDomain(),
  domain5 : sound().isString().isRequired().isDomain(),
  domain6 : sound().isString().isRequired().isDomain(),
  domain7 : sound().isString().isRequired().isDomain(),
  domain8 : sound().isString().isRequired().isDomain(),
  domain9 : sound().isString().isRequired().isDomain(),
  domain10 : sound().isString().isRequired().isDomain(),
  domain11 : sound().isString().isRequired().isDomain(),
  domain12 : sound().isString().isRequired().isDomain(),
  domain13 : sound().isString().isRequired().isDomain(),
  domain14 : sound().isString().isRequired().isDomain(),
  domain15 : sound().isString().isRequired().isDomain(),
  domain16 : sound().isString().isRequired().isDomain(),
  domain17 : sound().isString().isRequired().isDomain(),
  domain18 : sound().isString().isRequired().isDomain(),
  domain19 : sound().isString().isRequired().isDomain(),
  domain20 : sound().isString().isRequired().isDomain(),
  domain21 : sound().isString().isRequired().isDomain(),
  domain22 : sound().isString().isRequired().isDomain(),
  domain23 : sound().isString().isRequired().isDomain(),
  domain24 : sound().isString().isRequired().isDomain(),
}

const schemaForEmailAddresses = {
  email1 : sound().isString().isRequired().isEmailAddress(),
  email2 : sound().isString().isRequired().isEmailAddress(),
  email3 : sound().isString().isRequired().isEmailAddress(),
  email4 : sound().isString().isRequired().isEmailAddress(),
  email5 : sound().isString().isRequired().isEmailAddress(),
  email6 : sound().isString().isRequired().isEmailAddress(),
  email7 : sound().isString().isRequired().isEmailAddress(),
  email8 : sound().isString().isRequired().isEmailAddress(),
}

const schemaForTokens = {
  tok1 : sound().isString().isRequired().isToken(),
  tok2 : sound().isString().isRequired().isToken(),
  tok3 : sound().isString().isRequired().isToken(),
  tok4 : sound().isString().isRequired().isToken(),
  tok5 : sound().isString().isRequired().isToken(),
  tok6 : sound().isString().isRequired().isToken(),
  tok7 : sound().isString().isRequired().isToken(),
}

const schemaForUrlShortener = {
  title : sound().isString().isRequired(),
  url   : sound().isString().isRequired().isUrl(),
}

const schemaForMatches = {
  username : sound().isString().isRequired(),
  favColour1 : sound().isString().isMatch(/^(red|green|blue)$/),
  favColour2 : sound().isString().isMatch(/^(red|green|blue)$/),
}

const schemaForEnums = {
  username : sound().isString().isRequired(),
  favColour1 : sound().isString().isEnum([ 'red', 'green', 'blue' ]),
  favColour2 : sound().isString().isEnum([ 'red', 'green', 'blue' ]),
  favColour3 : sound().isString().isEnum([ 'red', 'green', 'blue' ]),
  favColour4 : sound().isString().isEnum([ 'red', 'green', 'blue' ]),
  favColour5 : sound().isString().isEnum([ 'red', 'green', 'blue' ]),
  favColour6 : sound().isString().toLowerCase().toTrim().isRequired().isEnum([ 'red', 'green', 'blue' ]),
  favColour7 : sound().isString().isRequired().isEnum([ 'red', 'green', 'blue' ]),
}

const tests = [

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
    test : function(t, err) {
      t.ok(_.isPlainObject(err), "is an object")
      t.end()
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
      usernameA : '',
    },
    test : function(t, err) {
      t.ok(_.isPlainObject(err), "is an object")
      t.ok( _.isUndefined(err.username1), "username1 string passes")
      t.ok( _.isUndefined(err.username2), "username2 string passes")
      t.ok(!_.isUndefined(err.username3), "username3 string fails")
      t.ok( _.isUndefined(err.username4), "username4 string passes")
      t.ok(!_.isUndefined(err.username5), "username5 string fails")
      t.ok( _.isUndefined(err.username6), "username6 string passes")
      t.ok(!_.isUndefined(err.username7), "username7 string fails")
      t.ok( _.isUndefined(err.username8), "username8 string passes")
      t.ok(!_.isUndefined(err.username9), "username9 string fails")
      t.ok(!_.isUndefined(err.usernameA), "usernameA string fails")

      t.equal(err.username3, "Username3 should be at least 3 characters")
      t.equal(err.username5, "Username5 should be at most 8 characters")
      t.equal(err.usernameA, "UsernameA is required")

      // for these, the first error should be these
      t.equal(err.username7, "Username7 should be at least 3 characters")
      t.equal(err.username9, "Username9 should be at most 8 characters")

      t.end()
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
    test : function(t, err) {
      t.ok(_.isPlainObject(err), "is an object")
      t.ok( _.isUndefined(err.int1), "integer passes")
      t.ok( _.isUndefined(err.int2), "integer passes")
      t.ok(!_.isUndefined(err.int3), "integer passes")
      t.ok( _.isUndefined(err.int4), "integer passes")
      t.ok(!_.isUndefined(err.int5), "integer passes")
      t.ok( _.isUndefined(err.int6), "integer passes")
      t.ok(!_.isUndefined(err.int7), "integer passes")
      t.ok( _.isUndefined(err.int8), "integer passes")
      t.ok(!_.isUndefined(err.int9), "integer passes")
      t.ok( _.isUndefined(err.int10), "integer passes")
      t.ok(!_.isUndefined(err.int11), "integer passes")
      t.ok( _.isUndefined(err.int12), "integer passes")
      t.ok(!_.isUndefined(err.int13), "integer passes")

      t.equal(err.int3, "Int3 should be at least 3")
      t.equal(err.int5, "Int5 should be at most 8")

      // for these, the first error should be these
      t.equal(err.int7, "Int7 should be at least 3")
      t.equal(err.int9, "Int9 should be at most 8")

      // for these, the first error should be these
      t.equal(err.int11, "Int11 should be greater than 3")
      t.equal(err.int13, "Int13 should be less than 8")

      t.end()
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
    test : function(t, err) {
      t.ok(_.isPlainObject(err), "is an object")
      t.ok( _.isUndefined(err.url1), "url1 passes")
      t.ok( _.isUndefined(err.url2), "url2 passes")
      t.ok( _.isUndefined(err.url3), "url3 passes")
      t.ok( _.isUndefined(err.url4), "url4 passes")
      t.ok(!_.isUndefined(err.url5), "url5 fails")
      t.ok(!_.isUndefined(err.url6), "url6 fails") // 'coz we want domain names
      t.ok( _.isUndefined(err.url7), "url7 passes")

      t.equal(err.url5, "url5 should be a URL and start with http:// or https://")
      t.equal(err.url6, "url6 should be a URL and start with http:// or https://")

      t.end()
    },
  },

  {
    name : 'Domains',
    schema : schemaForDomains,
    params : {
      domain1 : 'example.org',
      domain2 : 'my.example.org',
      domain3 : '1.cc', // doesn't make sure `cc` is a valid tld
      domain4 : 'hello-world.info',
      domain5 : 'my.app.development.example.com',
      domain6 : 'localhost.localdomain',
      domain7 : 'localhost',
      domain8 : 'hello_world.info',
      domain9 : '-.net',
      domain10 : '',
      domain11 : ' ',
      domain12 : '*',
      domain13 : '*.example.com',
      domain14 : '!.com',
      domain15 : '.com',
      domain16 : 'example.',
      domain17 : 'example.com.',
      domain18 : 'http://example.com',
      domain19 : 'me@example.com',
      domain20 : '-another.com',
      domain21 : 'another-.com',
      domain22 : 'another.c-m',
      domain23 : 'another.c',
      domain24 : 'status-2345.example.com',
    },
    test : function(t, err) {
      t.ok(_.isPlainObject(err), "is an object")
      t.ok( _.isUndefined(err.domain1), "domain1 passes")
      t.ok( _.isUndefined(err.domain2), "domain2 passes")
      t.ok( _.isUndefined(err.domain3), "domain3 passes")
      t.ok( _.isUndefined(err.domain4), "domain4 passes")
      t.ok( _.isUndefined(err.domain5), "domain5 passes")
      t.ok( _.isUndefined(err.domain6), "domain6 passes") // 'coz we want domain names
      t.ok(!_.isUndefined(err.domain7), "domain7 fails")
      t.ok(!_.isUndefined(err.domain8), "domain8 fails")
      t.ok(!_.isUndefined(err.domain9), "domain9 fails")
      t.ok(!_.isUndefined(err.domain10), "domain10 fails")
      t.ok(!_.isUndefined(err.domain11), "domain11 fails")
      t.ok(!_.isUndefined(err.domain12), "domain12 fails")
      t.ok(!_.isUndefined(err.domain13), "domain13 fails")
      t.ok(!_.isUndefined(err.domain14), "domain14 fails")
      t.ok(!_.isUndefined(err.domain15), "domain15 fails")
      t.ok(!_.isUndefined(err.domain16), "domain16 fails")
      t.ok(!_.isUndefined(err.domain17), "domain17 fails")
      t.ok(!_.isUndefined(err.domain18), "domain18 fails")
      t.ok(!_.isUndefined(err.domain19), "domain19 fails")
      t.ok(!_.isUndefined(err.domain20), "domain20 fails")
      t.ok(!_.isUndefined(err.domain21), "domain21 fails")
      t.ok(!_.isUndefined(err.domain22), "domain22 fails")
      t.ok(!_.isUndefined(err.domain23), "domain23 fails")
      t.ok( _.isUndefined(err.domain24), "domain24 passes")

      t.equal(err.domain7, "domain7 should be a FQDN such as example.com or my.example.org")

      t.end()
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
    test : function(t, err) {
      t.ok(_.isPlainObject(err), "is an object")
      t.ok(!_.isUndefined(err.email1), "email1 fails")
      t.ok(!_.isUndefined(err.email2), "email2 fails")
      t.ok(!_.isUndefined(err.email3), "email3 fails")
      t.ok( _.isUndefined(err.email4), "email4 passes")
      t.ok( _.isUndefined(err.email5), "email5 passes")
      t.ok( _.isUndefined(err.email6), "email6 passes")
      t.ok( _.isUndefined(err.email7), "email7 passes")
      t.ok(!_.isUndefined(err.email8), "email8 fails")

      t.equal(err.email1, "email1 is required")
      t.equal(err.email8, "email8 should be an Email Address")

      t.end()
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
    test : function(t, err) {
      t.ok(_.isPlainObject(err), "is an object")
      t.ok( _.isUndefined(err.tok1), "tok1 passes")
      t.ok( _.isUndefined(err.tok2), "tok2 passes")
      t.ok(!_.isUndefined(err.tok3), "tok3 fails")
      t.ok(!_.isUndefined(err.tok4), "tok4 fails")
      t.ok(!_.isUndefined(err.tok5), "tok5 fails")
      t.ok(!_.isUndefined(err.tok6), "tok6 fails")
      t.ok(!_.isUndefined(err.tok7), "tok7 fails")

      t.equal(err.tok3, "tok3 should start and end with letters/numbers and contain only lowercase letters, numbers and dashes")

      t.end()
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
      t.ok(_.isPlainObject(err), "is an object")

      t.end()
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
      t.ok(_.isPlainObject(err), "is an object")

      t.ok( _.isUndefined(err.username), "username is correct")
      t.ok( _.isUndefined(err.favColour1), "red is ok")
      t.ok(!_.isUndefined(err.favColour2), "purple is not ok")

      t.equal(err.favColour2, "favColour2 is not valid")

      t.end()
    },
  },

  {
    name : 'Test for .isEnum()',
    schema : schemaForEnums,
    params : {
      username : 'chilts',
      favColour1 : 'blue',
      favColour2 : 'pink',
      favColour3 : ' ',
      favColour4 : 'Red',
      favColour5 : true,
      favColour6 : '  RED  ',
      favColour7 : '',
    },
    test : function(t, err) {
      t.ok(_.isPlainObject(err), "is an object")

      t.ok( _.isUndefined(err.username), "username is correct")
      t.ok( _.isUndefined(err.favColour1), "'red' is ok")
      t.ok(!_.isUndefined(err.favColour2), "'purple' is not ok")
      t.ok(!_.isUndefined(err.favColour3), "' ' is not ok")
      t.ok(!_.isUndefined(err.favColour4), "'Red' is not ok")
      t.ok(!_.isUndefined(err.favColour5), "true is not ok")
      t.ok( _.isUndefined(err.favColour6), "'  RED  ' is ok")
      t.ok(!_.isUndefined(err.favColour7), "favColour7 is required")

      t.equal(err.favColour2, "favColour2 is not a valid value")
      t.equal(err.favColour3, "favColour3 is not a valid value")
      t.equal(err.favColour4, "favColour4 is not a valid value")
      t.equal(err.favColour5, "favColour5 should be a string")
      t.equal(err.favColour7, "favColour7 is required")

      t.end()
    },
  },

]

tests.forEach(function(v) {
  test(v.name, function(t) {
    const res = sound.validate(v.params, v.schema)
    v.test(t, res.err, res.val)
  })
})
