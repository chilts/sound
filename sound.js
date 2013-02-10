// --------------------------------------------------------------------------------------------------------------------
//
// sound.js - Make sure your data is sound! A validation library for Node.js.
//
// Copyright (c) 2013 Andrew Chilton
// - http://www.chilts.org/blog/
// - andychilton@gmail.com
//
// License: http://chilts.mit-license.org/2013/
//
// --------------------------------------------------------------------------------------------------------------------

var _ = require('underscore');

var valid = {
    boolean : {
        'true'  : true,
        'false' : false,
        't'     : true,
        'f'     : false,
        'yes'   : true,
        'no'    : false,
        'on'    : true,
        'off'   : false,
        '1'     : true,
        '0'     : false,
    },
};

// --------------------------------------------------------------------------------------------------------------------

var Constraint = function(name) {
    this._name = name;
    this._required = false;
    this._requiredMsg = undefined;
    this.rules = [];
    return this;
};

Constraint.prototype.name = function(_name) {
    this._name = _name;
    return this;
};

Constraint.prototype.required = function(msg) {
    this._required = true;
    this._requiredMsg = msg;
    return this;
};

// --------------------------------------------------------------------------------------------------------------------
// validations

Constraint.prototype.isString = function(msg) {
    this.rules.push({
        type : 'isString',
        msg  : msg
    });
    return this;
};

Constraint.prototype.isInteger = function(msg) {
    this.rules.push({
        type : 'isInteger',
        msg  : msg
    });
    return this;
};

Constraint.prototype.isFloat = function(msg) {
    this.rules.push({
        type : 'isFloat',
        msg  : msg
    });
    return this;
};

Constraint.prototype.isBoolean = function(msg) {
    this.rules.push({
        type : 'isBoolean',
        msg  : msg
    });
    return this;
};

Constraint.prototype.isDate = function(msg) {
    this.rules.push({
        type : 'isDate',
        msg  : msg
    });
    return this;
};

Constraint.prototype.lt = function(value, msg) {
    this.rules.push({
        type  : 'lt',
        value : value,
        msg   : msg

    });
    return this;
};

Constraint.prototype.gt = function(value, msg) {
    this.rules.push({
        type  : 'gt',
        value : value,
        msg   : msg

    });
    return this;
};

Constraint.prototype.min = function(value, msg) {
    this.rules.push({
        type  : 'min',
        value : value,
        msg   : msg

    });
    return this;
};

Constraint.prototype.max = function(value, msg) {
    this.rules.push({
        type  : 'max',
        value : value,
        msg   : msg
    });
    return this;
};

Constraint.prototype.minLen = function(len, msg) {
    this.rules.push({
        type : 'minLen',
        len  : len,
        msg  : msg
    });
    return this;
};

Constraint.prototype.maxLen = function(len, msg) {
    console.log('Pushing maxLen=' + len + ' onto the rules');
    this.rules.push({
        type : 'maxLen',
        len  : len,
        msg  : msg
    });
    return this;
};

Constraint.prototype.matches = function(regex, msg) {
    this.rules.push({
        type  : 'matches',
        regex : regex,
        msg   : msg
    });
    return this;
};

Constraint.prototype.isUrl = function(msg) {
    this.rules.push({
        type : 'isUrl',
        msg  : msg
    });
    return this;
};

// --------------------------------------------------------------------------------------------------------------------
// conversions

Constraint.prototype.trim = function() {
    this.rules.push({
        type : 'trim',
    });
    return this;
};

Constraint.prototype.lowercase = function() {
    this.rules.push({
        type : 'lowercase',
    });
    return this;
};

Constraint.prototype.uppercase = function() {
    this.rules.push({
        type : 'uppercase',
    });
    return this;
};

Constraint.prototype.replace = function(a, b) {
    this.rules.push({
        type : 'replace',
        a : a,
        b : b,
    });
    return this;
};

// --------------------------------------------------------------------------------------------------------------------
// coercions

Constraint.prototype.toInteger = function() {
    this.rules.push({
        type : 'toInteger',
    });
    return this;
};

Constraint.prototype.toFloat = function() {
    this.rules.push({
        type : 'toFloat',
    });
    return this;
};

Constraint.prototype.toBoolean = function() {
    this.rules.push({
        type : 'toBoolean',
    });
    return this;
};

// --------------------------------------------------------------------------------------------------------------------
// sound itself (for the constraints) and it's only function for validation

var sound = function(name) {
    return new Constraint(name);
};

sound.validate = function(params, schema, callback) {

    var res = {};
    var error = {};
    var ok = true;

    var res = _.extend({}, params);
    console.log('1 = res:', res);

    // go through each property of the schema (we ignore all others)
    var keys = Object.keys(schema);
    keys.forEach(function(key, i) {
        console.log('===============================================================================');
        console.log('Checking ' + key);
        console.log('* Name=' + schema[key]._name);
        console.log('* key=' + key);

        // validate the param against it's own constraints in the schema
        // Note: sound.validateParam(name, value, schema, fn)
        console.log('* value=[' + res[key] + ']');
        validateParam(schema[key]._name || key, res[key], schema[key], function(err, newValue) {
            console.log('* err:', err);
            if (err) {
                ok = false;
                error[key] = err;
            }
            res[key] = newValue;
            console.log('cumulative errors:', error);
            console.log('cumulative result:', res);
        });

    });

    console.log('=== END ========================================================================');

    console.log('Final err:', error);
    console.log('Final res:', res);
    callback(ok ? null : error, res);
};

var validateParam = function(name, value, constraint, done) {
    console.log('=== Validating : ' + name + ' ===');
    console.log('value=[' + value + ']');
    console.log(constraint);

    // first thing to do is see if this param is required ... if not, and it's undefined then we get out of here
    if ( _.isUndefined(value) || _.isNull(value) ) {
        if ( constraint._required ) {
            return done(constraint._requiredMsg || name + ' is required', value);
        }
        else {
            return done();
        }
    }
    // else, we have a value, so keep checking things

    var err;

    // now, loop through all the constraints
    for(var i = 0; i < constraint.rules.length; i++ ) {
        var r = constraint.rules[i];
        console.log(i + ') ', r);

        // check all of the different constraints
        if ( r.type === 'isString' ) {
            if ( !_.isString(value) ) {
                return done(r.msg || name + ' should be a string', value);
            }
        }
        else if ( r.type === 'isInteger' ) {
            if ( parseInt(value, 10) !== value ) {
                return done(r.msg || name + ' should be an integer', value);
            }
        }
        else if ( r.type === 'isFloat' ) {
            if ( typeof value !== 'number' ) {
                return done(r.msg || name + ' should be a float', value);
            }
        }
        else if ( r.type === 'isBoolean' ) {
            if ( !_.isBoolean(value) ) {
                return done(r.msg || name + ' should be a boolean', value);
            }
        }
        else if ( r.type === 'isDate' ) {
            if ( !_.isDate(value) ) {
                return done(r.msg || name + ' should be a date', value);
            }
        }
        else if ( r.type === 'gt' ) {
            if ( value <= r.value ) {
                return done(r.msg || name + ' should be greater than ' + r.value, value);
            }
        }
        else if ( r.type === 'lt' ) {
            if ( value >= r.value ) {
                return done(r.msg || name + ' should be less than ' + r.value, value);
            }
        }
        else if ( r.type === 'min' ) {
            if ( value < r.value ) {
                return done(r.msg || name + ' should be at least ' + r.value, value);
            }
        }
        else if ( r.type === 'max' ) {
            if ( value > r.value ) {
                return done(r.msg || name + ' should be at most ' + r.value, value);
            }
        }
        else if ( r.type === 'minLen' ) {
            if ( value.length < r.len ) {
                return done(r.msg || name + ' should be at least ' + r.len + ' characters', value);
            }
        }
        else if ( r.type === 'maxLen' ) {
            console.log('*** value=' + value);
            console.log('*** value.length=' + value.length);
            console.log('*** r.len=' + r.len);
            if ( value.length > r.len ) {
                console.log('*** dodgy');
                return done(r.msg || name + ' should be at most ' + r.len + ' characters', value);
            }
        }
        else if ( r.type === 'matches' ) {
            console.log('Checking value ' + value + ' against regex');
            var m = value.match(r.regex);
            console.log('m:', m);
            if ( !value.match(r.regex) ) {
                console.log('Fails regex for name=' + name);
                return done(r.msg || name + ' does not validate', value);
            }
        }
        else if ( r.type === 'isUrl' ) {
            console.log('Checking URL against a regex');
            // ToDo: http://someweblog.com/url-regular-expression-javascript-link-shortener/
            // From: http://stackoverflow.com/questions/8188645/javascript-regex-to-match-a-url-in-a-field-of-text
            // * (http|ftp|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?
            if ( !value.match(/^https?:\/\/[A-Za-z0-9][A-Za-z0-9-]*(\.[A-Za-z]+)+(:\d+)?(\/\S*)?$/) ) {
                console.log('Checking URL against a regex');
                return done(r.msg || name + ' should be a URL and start with http:// or https://', value);
            }
        }
        else if ( r.type === 'trim' ) {
            console.log('Trimming the value');
            value = value.replace(/^\s+|\s+$/g,'')
            console.log('-> newValue=[' + value + ']');
        }
        else if ( r.type === 'lowercase' ) {
            console.log('Lowercasing the value');
            value = value.toLowerCase();
            console.log('-> newValue=[' + value + ']');
        }
        else if ( r.type === 'uppercase' ) {
            console.log('Uppercasing the value');
            value = value.toUpperCase();
            console.log('-> newValue=[' + value + ']');
        }
        else if ( r.type === 'replace' ) {
            console.log('Replacing a with b in the value');
            value = value.replace(r.a, r.b);
            console.log('-> newValue=[' + value + ']');
        }
        else if ( r.type === 'toInteger' ) {
            console.log('Changing the type to an integer');
            value = parseInt(value, 10);
            if ( Number.isNaN(value) ) {
                return done(r.msg || name + ' could not be converted to an integer', value);
            }
            console.log('-> newValue=[' + value + ']');
        }
        else if ( r.type === 'toFloat' ) {
            console.log('Changing the type to a float');
            value = parseFloat(value);
            if ( Number.isNaN(value) ) {
                return done(r.msg || name + ' could not be converted to a float', value);
            }
            console.log('-> newValue=[' + value + ']');
        }
        else if ( r.type === 'toBoolean' ) {
            console.log('Changing the type to an boolean');
            if ( _.isString(value) ) {
                console.log('GOT A STRING, CONVERTING TO BOOL -> ' + value.toLowerCase());
                console.log('GOT A STRING, CONVERTING TO BOOL -> ' + valid.boolean[value.toLowerCase()]);
                if ( value.toLowerCase() in valid.boolean ) {
                    value = valid.boolean[value.toLowerCase()];
                }
                else {
                    // do nothing, the user needs to validate their input prior to this conversion
                    return done(r.msg || name + ' is not a recognised value when converting to boolean', value);
                }
            }
            else if ( _.isNumber(value) ) {
                console.log('[[[ right here for ' + value);
                value = !(value == 0);
            }
            else {
                // do nothing, the user needs to validate their input prior to this conversion
                return done(r.msg || name + ' value should be a string or integer when converting to boolean', value);
            }
            console.log('-> newValue=[' + value + ']');
        }
        else {
            throw new Error('Program Error: unknown type ' + r.type);
        }
    }

    // no error, so just return nothing
    done(null, value);
};

// --------------------------------------------------------------------------------------------------------------------

module.exports = sound;

// --------------------------------------------------------------------------------------------------------------------
