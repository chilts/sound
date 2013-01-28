// --------------------------------------------------------------------------------------------------------------------
//
// sound.js - Make sure your data is sound! Validation library for Node.js.
//
// Copyright (c) 2013 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://appsattic.mit-license.org/2013/
//
// --------------------------------------------------------------------------------------------------------------------

var _ = require('underscore');

// --------------------------------------------------------------------------------------------------------------------

var Constraint = function(type) {
    this.type = type;
    this.rules = [];
    return this;
};

Constraint.prototype.name = function(_name) {
    this._name = _name;
    return this;
};

Constraint.prototype.required = function() {
    this.rules.push({
        type : 'required',
        required : true,
    });
    return this;
};

Constraint.prototype.min = function(value) {
    this.rules.push({
        type : 'min',
        value : value,
    });
    return this;
};

Constraint.prototype.max = function(value) {
    this.rules.push({
        type : 'max',
        value : value,
    });
    return this;
};

Constraint.prototype.minLen = function(len) {
    this.rules.push({
        type : 'minLen',
        len : len,
    });
    return this;
};

Constraint.prototype.maxLen = function(len) {
    console.log('Pushing maxLen=' + len + ' onto the rules');
    this.rules.push({
        type : 'maxLen',
        len : len,
    });
    return this;
};

Constraint.prototype.matches = function(regex) {
    this.rules.push({
        type : 'matches',
        regex : regex,
    });
    return this;
};

Constraint.prototype.isUrl = function() {
    this.rules.push({
        type : 'isUrl',
    });
    return this;
};

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

Constraint.prototype.toInteger = function() {
    this.rules.push({
        type : 'toInteger',
    });
    return this;
};

// --------------------------------------------------------------------------------------------------------------------

var sound = {};

sound.string = function(name) {
    return new Constraint('string');
};

sound.integer = function(name) {
    return new Constraint('integer');
};

sound.float = function(name) {
    return new Constraint('float');
};

sound.boolean = function(name) {
    return new Constraint('boolean');
};

sound.date = function(name) {
    return new Constraint('date');
};

// --------------------------------------------------------------------------------------------------------------------

sound.validate = function(params, schema, callback) {
    var res = {};
    var error = {};
    var ok = true;

    var res = _.extend({}, params);
    console.log('1 = res:', res);

    // go through each property
    var keys = Object.keys(schema);
    keys.forEach(function(key, i) {
        console.log('===============================================================================');
        console.log('Checking ' + key);
        console.log('* Name=' + schema[key]._name);
        console.log('* key=' + key);

        console.log('* value=[' + res[key] + ']');
        sound.validateParam(schema[key]._name || key, res[key], schema[key], function(err, newValue) {
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

sound.validateParam = function(name, value, constraint, callback) {
    console.log('=== Validating : ' + name + ' ===');
    console.log('value=[' + value + ']');
    console.log(constraint);

    // firstly check the type
    switch ( constraint.type ) {
    case 'string':
        if ( !_.isString(value) ) {
            return callback(name + ' should be of type ' + constraint.type, value);
        }
        break;
    case 'integer':
        if ( parseInt(value, 10) !== value ) {
            return callback(name + ' should be of type ' + constraint.type, value);
        }
        else {
            console.log(name + 'integer is valid');
        }
        break;
    case 'float':
        if ( typeof value !== 'number' ) {
            return callback(name + ' should be of type ' + constraint.type, value);
        }
        break;
    case 'boolean':
        if ( !_.isBoolean(value) ) {
            return callback(name + ' should be of type ' + constraint.type, value);
        }
        break;
    case 'date':
        if ( !_.isDate(value) ) {
            return callback(name + ' should be of type ' + constraint.type, value);
        }
        break;
    }

    var err;

    // now, loop through all the constraints
    for(var i = 0; i < constraint.rules.length; i++ ) {
        var r = constraint.rules[i];
        console.log(i + ') ', r);

        // check all of the different constraints
        if ( r.type === 'required' ) {
            if ( _.isUndefined(value) || _.isNull(value) ) {
                return callback(name + ' is required', value);
            }
            if ( value.length === 0 ) {
                return callback(name + ' is required', value);
            }
        }
        else if ( r.type === 'min' ) {
            if ( value < r.value ) {
                return callback(name + ' should be at least ' + r.value, value);
            }
        }
        else if ( r.type === 'max' ) {
            if ( value > r.value ) {
                return callback(name + ' should be at most ' + r.value, value);
            }
        }
        else if ( r.type === 'minLen' ) {
            if ( value.length < r.len ) {
                return callback(name + ' should be at least ' + r.len + ' characters', value);
            }
        }
        else if ( r.type === 'maxLen' ) {
            console.log('*** value=' + value);
            console.log('*** value.length=' + value.length);
            console.log('*** r.len=' + r.len);
            if ( value.length > r.len ) {
                console.log('*** dodgy');
                return callback(name + ' should be at most ' + r.len + ' characters', value);
            }
        }
        else if ( r.type === 'matches' ) {
            console.log('Checking value ' + value + ' against regex');
            var m = value.match(r.regex);
            console.log('m:', m);
            if ( !value.match(r.regex) ) {
                console.log('Fails regex for name=' + name);
                return callback(name + ' does not validate', value);
            }
        }
        else if ( r.type === 'isUrl' ) {
            console.log('Checking URL against a regex');
            // ToDo: http://someweblog.com/url-regular-expression-javascript-link-shortener/
            // From: http://stackoverflow.com/questions/8188645/javascript-regex-to-match-a-url-in-a-field-of-text
            // * (http|ftp|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?
            if ( !value.match(/^https?:\/\/[A-Za-z0-9][A-Za-z0-9-]*(\.[A-Za-z]+)+(:\d+)?(\/\S*)?$/) ) {
                console.log('Checking URL against a regex');
                return callback(name + ' should be a URL and start with http:// or https://', value);
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
            console.log('-> newValue=[' + value + ']');
        }
        else {
            throw new Error('Program Error: unknown type ' + r.type);
        }
    }

    // no error, so just return nothing
    callback(null, value);
};

// --------------------------------------------------------------------------------------------------------------------

module.exports = exports = sound;

// --------------------------------------------------------------------------------------------------------------------
