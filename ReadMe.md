# Sound #

Make sure your data is sound! Schema generator, converter and validation library for Node.js.

## About ##

* powerful schema generator and validator
* control over your error messages
* errors in objects, not arrays

Advantages over JSON Schema:

* much much simpler to generate and use
* better default error messages
* control over error message depending on which validation fails
* errors relate to the property name, not randomly placed in an arbitrary array

We aim to test every part of `sound` which means we currently have over 350 tests.

```
# tests 369
# pass  369
```

We also aim to have 100% code coverage of `sound.js` - using `c8` - which is now almost 700 lines:

```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |                   
 sound.js |     100 |      100 |     100 |     100 |                   
----------|---------|----------|---------|---------|-------------------
```

## Synopsis ##

Take an object and verify its properties:

```
import sound from 'sound'

const schema = {
  username: sound().isString().toLowerCase().toTrim().isRequired().isMatch(/^[a-z0-9]{4,16}$/),
  password: sound().isString().isRequired().isMinLen(8),
  age: sound().isInteger().isRequired().isMinVal(13),
}

const user = {
  username: 'chilts',
  password: 'abcdefgh',
  age: 15,
}

const check = sound.validate(params, schema)
if ( check.ok ) {
  // everything validated ... params contained in `check.val`
  // e.g. { username: 'chilts', password: '12345678', age: 15 }
}
else {
  // something failed validation ... errors contained in `check.err`
  // e.g. { username: 'username is required', password: 'password should be at least 8 characters', age: 'age should be at least 13' }
}
```

## Examples ##

An example schema for a user, with various properties to show you different aspects of `sound`:

```
const schema = {
  username : sound().isString().toLowerCase().toTrim().isRequired().isMatch(/^[a-z0-9]{4,16}$/),
  password : sound().isString().isRequired().isMinLen(8).isMaxLen(100),
  email    : sound().isString().isRequired().isEmailAddress(),
  logins   : sound().isInteger().isRequired().isMinVal(0),
  awesome  : sound().isString().hasDefault('yes').toBoolean().isBoolean(),
  url      : sound().isString().isUrl(), // optional
  isAdmin  : sound().isString().isRequired().toBoolean().isBoolean(),
  dob      : sound().isDate(), // accepts 'yyyy-mm-dd'
  agree    : sound().isString().toBoolean().isEqual(true), // make sure they tick T&C's
  color    : sound().isString().toLowerCase().toTrim().isRequired().isEnum([ 'red', 'green', 'blue' ]),
}

const params = {
  username : 'chilts',
  password : 'abcdefgh',
  email : 'me@example.com',
  agree : 'on', // will convert to true
}

const check = sound.validate(params, schema)
if ( check.ok ) {
  // everything validated ... params contained in `check.val`
}
else {
  // something failed validation ... errors contained in `check.err`
}
```

If anything fails validation, then err will be an object with keys set to each field for each error. Only one error per
field in the schema will be reported.

If no failures are detected, err is just `{}`. You need to check `checks.ok` to see if validation passed or failed.

```
const check = sound.validate(params1, schema)
if ( !check.ok ) {
  // something failed, check the keys in `check.err.*`
  ...
  return
}

// all ok, the valid (and perhaps converted) values are in `check.val.*`
```

An error may look like:

```
check.err: {
  password: 'Password should be at least 8 characters'
  logins: 'Logins should be of type integer',
  pi: 'PI should be of type float',
  date: 'Date should be of type date'
}
```

A valid value may look like:

```
check.val: {
  username: 'chilts'
  password: 'abcdefgh'
  email: 'me@example.com',
  agree: true,
}
```

## Checks ##

* isString()
* isInteger()
* isFloat()
* isBoolean()
* isDate()
* isObject()
* isArray()
* isUrl()
* isDomain()
* isEmailAddress()
* isToken()
* isMatch()
* isEnum()
* toTrim()
* toLowerCase()
* toUpperCase()
* toReplace()
* isEqual()
* isNotEmpty()
* isMinLen()
* isMaxLen()
* isMinVal()
* isMaxVal()
* isGreaterThan()
* isLessThan()

## Coercions ##

* toString()
* toString()
* toInteger()
* toFloat()
* toBoolean()

## Unknown Params ##

Only params that we know about are passed back as `check.val`.

## Other Validation Libraries ##

There are other validation libraries out there, but they all give me errors which are arrays. To me, this is useless. I
don't want to list all of the errors at the top of a form, nor do I know which order those errors are in if I want to
pick and choose. I want the err to be an object with the only keys set to be to ones that fail.

Currently 'sound' only reports the first error it encounters with each field and it is likely to stay this way (due to
the problem and overlap required to keep trying every test even if the first one has failed).

## Changelog ##

* v3.0.0 (2022-07-19)
  * switch from CommonJS to ESModules
  * modernise the codebase
  * use eslint to check style (now 2 space indent, no semi-colons)
* v2.7.0 (2021-01-21)
* v2.6.1 (2019-02-25)
* v2.6.0 (2019-02-25)
* v2.5.0 (2018-07-19)
* v2.4.0 (2018-07-19)
* v2.3.0 (2018-07-19)
* v2.2.0 (2018-03-01)
* v2.1.0 (2018-03-01)
* v2.0.0 (2018-03-01)
* v1.2.2 (2018-02-28)
* v1.2.1 (2015-05-26)
* v1.2.0 (2014-07-30)
* v1.1.0 (2014-06-28)
* v1.0.1 (2014-06-28)
* v1.0.0 (2014-06-28)
* v0.3.3 (2014-06-28)
* v0.3.2 (2014-06-28)
* v0.3.1 (2014-01-02)
* v0.3.0 (2014-01-02)
* v0.2.2 (2013-04-15)
* v0.2.1 (2013-04-15)
* v0.2.0 (2013-04-15)
* v0.1.0 (2013-02-01)
  * first release

## Author ##

Written by

* [Andrew Chilton](https://chilts.org/)
* [Twitter](https://twitter.com/andychilton).
* [GitHub](https://github.com/chilts).

## License ##

MIT - https://chilts.mit-license.org/2013/

(Ends)
