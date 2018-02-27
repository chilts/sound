sound.js - make sure your data is sound!

[![Build Status](https://travis-ci.org/appsattic/sound.png?branch=master)](https://travis-ci.org/appsattic/sound)

## Synopsis ##

## Examples ##

```
var schema = {
    username : sound().isString().lowercase().trim().required().matches(/^[a-z0-9]{4,16}$/),
    password : sound().isString().required().minLen(8).maxLen(100),
    email    : sound().isString().required().isEmailAddress(),
    logins   : sound().isInteger().required().min(0),
    awesome  : sound().isString().default('yes').toBoolean().isBoolean(),
    url      : sound().isString().isUrl(), // optional
    isAdmin  : sound().isString().required().toBoolean().isBoolean(),
    dob      : sound().isDate(), // accepts 'yyyy-mm-dd'
    agree    : sound().isString().toBoolean().is(true), // make sure they tick T&C's
};

var params = {
    username : 'chilts',
    password : 'abcdefgh',
    email : 'me@example.com',
    agree : 'on', // will convert to true
};

var out = sound.validate(params, schema);
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
var out = sound.validate(params1, schema)
if ( !out.ok ) {
    // something failed, check the keys in `out.err.*`
    ...
    return;
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

Written by [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

## License ##

MIT - http://chilts.mit-license.org/2013/

(Ends)
