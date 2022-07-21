import _ from 'lodash'
import test from 'tape'
import sound from '../sound.js'

const signup = {
  username : sound().isString('letters and numbers only').toLowerCase().toTrim().isRequired().isToken().isMinLen(3),
  email    : sound().isString('should be an email address').toTrim().isEmailAddress(),
  password : sound().isString('use at least 8 chars').isRequired().isMinLen(8).isMaxLen(100),
}

const nullsBeGone = {
  username  : sound().isString().isRequired(),
  interests : sound().isString(),
}

const tests = [

  {
    name : 'Validate username, email and password',
    schema : signup,
    params : {
      username : '  Andy  ',
      password : 's3kr1ts3kr1t',
      email    : 'me@example.com',
    },
    test : function(t, res) {
      t.ok(_.isPlainObject(res.err), "is an object")

      t.equal(res.ok, true, 'Sign up passes')

      t.equal(res.val.username, 'andy', 'username has been trimmed and lowercased')
      t.equal(res.val.password, 's3kr1ts3kr1t', 'password is intact')
      t.equal(res.val.email, 'me@example.com', 'email is the same')

      t.equal(res.arg.username, '  Andy  ', 'username is the same')
      t.equal(res.arg.password, 's3kr1ts3kr1t', 'password is intact')
      t.equal(res.arg.email, 'me@example.com', 'email is still the same')

      t.end()
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
      t.ok(_.isPlainObject(res.err), "is an object")

      t.equal(res.ok, true, 'Sign up passes')

      t.equal(res.val.username, 'andy', 'username has been trimmed and lowercased')
      t.equal(res.val.password, 's3kr1ts3kr1t', 'password is intact')
      t.equal(res.val.email, undefined, 'email is undefined')

      t.equal(res.arg.username, '  Andy  ', 'username is the same')
      t.equal(res.arg.password, 's3kr1ts3kr1t', 'password is intact')
      t.equal(res.arg.email, '', 'email is still an empty string')

      t.end()
    },
  },

  {
    name : 'nulls should not appear when nothing given',
    schema : nullsBeGone,
    params : {
      username : 'chilts',
    },
    test : function(t, res) {
      t.ok(_.isPlainObject(res.err), "is an object")

      t.equal(res.ok, true, 'Validates ok')

      t.equal(res.val.username, 'chilts', 'username given')
      t.ok(!('interests' in res.val), 'There should be no interests in the val')

      t.end()
    },
  },

]

tests.forEach(function(v) {
  test(v.name, function(t) {
    const res = sound.validate(v.params, v.schema)
    v.test(t, res)
  })
})
