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
}
else {
  // something failed validation ... errors contained in `check.err`
}
```

## Examples ##

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

const out = sound.validate(params, schema)
if ( out.ok ) {
  // everything validated ... params contained in `out.val`
}
else {
  // something failed validation ... errors contained in `out.err`
}
```

If anything fails validation, then err will be an object with keys set to each field for each error. Only one error per
field in the schema will be reported.

If no failures are detected, err is just `{}`. You need to check `out.ok` to see if validation passed or failed.

```
const out = sound.validate(params1, schema)
if ( !out.ok ) {
  // something failed, check the keys in `out.err.*`
  ...
  return
}

// all ok
```

An error may look like:

```
{
  password: 'Password should be at least 8 characters'
  logins: 'Logins should be of type integer',
  pi: 'PI should be of type float',
  date: 'Date should be of type date'
}
```

## Unknown Params ##

Only params that we know about are passed back as `out.val`.

## Other Validation Libraries ##

There are other validation libraries out there, but they all give me errors which are arrays. To me, this is useless. I
don't want to list all of the errors at the top of a form, nor do I know which order those errors are in if I want to
pick and choose. I want the err to be an object with the only keys set to be to ones that fail.

Currently 'sound' only reports the first error it encounters with each field and it is likely to stay this way (due to
problem and overlap required to keep trying every test even if the first one has failed).

## Author ##

Written by

* [Andrew Chilton](https://chilts.org/)
* [Twitter](https://twitter.com/andychilton).
* [GitHub](https://github.com/chilts).

## License ##

MIT - https://chilts.mit-license.org/2013/

(Ends)
