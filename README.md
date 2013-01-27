sound.js - make sure your data is sound!

# Synopsis #

```
var schema = {
    username : sound.string().required().matches(/^[a-z0-9]{4,16}$/),
    password : sound.string().required().minLen(8).maxLen(100),
    email    : sound.string().required().isEmailAddress(),
    logins   : sound.integer().required().min(0),
    url      : sound.string().isUrl(), // optional
    isAdmin  : sound.boolean().required(),
    dob      : sound.date(), // accepts 'yyyy-mm-dd'
};

var params = {
    username : 'chilts',
    password : 'abcdefgh',
    email : 'me@example.com',
};

var err = sound.validate(params, schema);
```

If anything fails validation, then err will be an object with keys set to each field for each error. Only one error per
field in the schema will be reported.

If no failures are detected, err is 'undefined' rather than '{}' since that is truthy false.

```
var err = sound.validate(params1, schema);
if (err) {
   // something failed, check the keys in err.*
   ...
}
else {
   // all ok
   ...
}
```

An error object may look like:

```
{
    password: 'Password should be at least 8 characters'
    logins: 'Logins should be of type integer',
    pi: 'PI should be of type float',
    date: 'Date should be of type date'
}
```

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

MIT - http://appsattic.mit-license.org/2013/

(Ends)
