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

Constraint.prototype.isEmailAddress = function(msg) {
    this.rules.push({
        type : 'isEmailAddress',
        msg  : msg
    });
    return this;
};

Constraint.prototype.isToken = function(msg) {
    this.rules.push({
        type : 'isToken',
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

Constraint.prototype.toInteger = function(msg) {
    this.rules.push({
        type : 'toInteger',
        msg  : msg,
    });
    return this;
};

Constraint.prototype.toFloat = function(msg) {
    this.rules.push({
        type : 'toFloat',
        msg  : msg,
    });
    return this;
};

Constraint.prototype.toBoolean = function(msg) {
    this.rules.push({
        type : 'toBoolean',
        msg  : msg,
    });
    return this;
};

// --------------------------------------------------------------------------------------------------------------------
// sound itself (for the constraints) and it's only function for validation

var sound = function(name) {
    return new Constraint(name);
};

sound.validate = function(arg, schema) {
    var val = {};
    var err = {};
    var ok = true;

    // go through each property of the schema (we ignore all others)
    var keys = Object.keys(schema);
    keys.forEach(function(key, i) {
        // validate the arg against it's own constraints in the schema
        // Note: sound.validateParam(name, value, schema, fn)
        var validation = validateParam(schema[key]._name || key, arg[key], schema[key]);
        if ( validation.ok ) {
            val[key] = validation.val;
        }
        else {
            ok = false;
            err[key] = validation.err;
        }
    });

    return {
        ok  : ok,
        arg : arg,
        val : val,
        err : err,
    };
};

var validateParam = function(name, value, constraint) {
    // first thing to do is see if this param is required ... if not, and it's undefined then we get out of here
    if ( _.isUndefined(value) || _.isNull(value) || value === '' ) {
        if ( constraint._required ) {
            return {
                ok  : false,
                err : constraint._requiredMsg || name + ' is required',
            };
        }
        else {
            return {
                ok  : true,
            };
        }
    }
    // else, we have a value, so keep checking things

    var err;

    // now, loop through all the constraints
    for(var i = 0; i < constraint.rules.length; i++ ) {
        var r = constraint.rules[i];

        // check all of the different constraints
        if ( r.type === 'isString' ) {
            if ( !_.isString(value) ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' should be a string',
                };
            }
        }
        else if ( r.type === 'isInteger' ) {
            if ( parseInt(value, 10) !== value ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' should be an integer',
                };
            }
        }
        else if ( r.type === 'isFloat' ) {
            if ( typeof value !== 'number' ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' should be a float',
                };
            }
        }
        else if ( r.type === 'isBoolean' ) {
            if ( !_.isBoolean(value) ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' should be a boolean',
                };
            }
        }
        else if ( r.type === 'isDate' ) {
            if ( !_.isDate(value) ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' should be a date',
                };
            }
        }
        else if ( r.type === 'gt' ) {
            if ( value <= r.value ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' should be greater than ' + r.value,
                };
            }
        }
        else if ( r.type === 'lt' ) {
            if ( value >= r.value ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' should be less than ' + r.value,
                };
            }
        }
        else if ( r.type === 'min' ) {
            if ( value < r.value ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' should be at least ' + r.value,
                };
            }
        }
        else if ( r.type === 'max' ) {
            if ( value > r.value ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' should be at most ' + r.value,
                };
            }
        }
        else if ( r.type === 'minLen' ) {
            if ( value.length < r.len ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' should be at least ' + r.len + ' characters',
                };
            }
        }
        else if ( r.type === 'maxLen' ) {
            if ( value.length > r.len ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' should be at most ' + r.len + ' characters',
                };
            }
        }
        else if ( r.type === 'matches' ) {
            var m = value.match(r.regex);
            if ( !value.match(r.regex) ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' does not validate',
                };
            }
        }
        else if ( r.type === 'isUrl' ) {
            // ToDo: http://someweblog.com/url-regular-expression-javascript-link-shortener/
            // From: http://stackoverflow.com/questions/8188645/javascript-regex-to-match-a-url-in-a-field-of-text
            // * (http|ftp|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?
            if ( !value.match(/^https?:\/\/[A-Za-z0-9][A-Za-z0-9-]*(\.[A-Za-z]+)+(:\d+)?(\/\S*)?$/) ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' should be a URL and start with http:// or https://',
                };
            }
        }
        else if ( r.type === 'isEmailAddress' ) {
            // Validating Email Addresses is Difficult!
            // ! $ & * - = ^ ` | ~ # % ' + / ? _ { }
            if ( !value.match(/^[A-Za-z0-9\._%+-]+@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/) ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' should be an Email Address',
                };
            }
        }
        else if ( r.type === 'isToken' ) {
            // Tokens are like URI segments. Lowercase letters, numbers and dashes.
            if ( !value.match(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/) ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' should start and end with letters/numbers and contain only lowercase letters, numbers and dashes',
                };
            }
        }
        else if ( r.type === 'trim' ) {
            value = value.replace(/^\s+|\s+$/g,'')
        }
        else if ( r.type === 'lowercase' ) {
            value = value.toLowerCase();
        }
        else if ( r.type === 'uppercase' ) {
            value = value.toUpperCase();
        }
        else if ( r.type === 'replace' ) {
            value = value.replace(r.a, r.b);
        }
        else if ( r.type === 'toInteger' ) {
            value = parseInt(value, 10);
            if ( Number.isNaN(value) ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' could not be converted to an integer',
                };
            }
        }
        else if ( r.type === 'toFloat' ) {
            value = parseFloat(value);
            if ( Number.isNaN(value) ) {
                return {
                    ok  : false,
                    err : r.msg || name + ' could not be converted to a float',
                };
            }
        }
        else if ( r.type === 'toBoolean' ) {
            if ( _.isString(value) ) {
                if ( value.toLowerCase() in valid.boolean ) {
                    value = valid.boolean[value.toLowerCase()];
                }
                else {
                    // do nothing, the user needs to validate their input prior to this conversion
                    return {
                        ok  : false,
                        err : r.msg || name + ' is not a recognised value when converting to boolean',
                    };
                }
            }
            else if ( _.isNumber(value) ) {
                value = !(value == 0);
            }
            else {
                // do nothing, the user needs to validate their input prior to this conversion
                return {
                    ok  : false,
                    err : r.msg || name + ' value should be a string or integer when converting to boolean',
                };
            }
        }
        else {
            throw new Error('Program Error: unknown type ' + r.type);
        }
    }

    // no error, so just return nothing
    return {
        ok  : true,
        val : value,
    };
};

// --------------------------------------------------------------------------------------------------------------------

module.exports = sound;

// --------------------------------------------------------------------------------------------------------------------
