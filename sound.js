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
        console.log('Checking ' + key);
        console.log('* ' + schema[key]._name);
        console.log('* ' + key);
        var err = sound.validateParam(schema[key]._name || key, params[key], schema[key]);
        if (err) {
            ok = false;
            error[key] = err;
        }
    });

    console.log('2 = res:', res);
    callback(ok ? null : error, ok ? res : null);
};

sound.validateParam = function(name, value, constraint) {
    console.log('--- ' + name + ' ---');
    console.log('--- ' + value + ' ---');
    console.log(constraint);
    console.log('----------------');
    // firstly check the type
    switch ( constraint.type ) {
    case 'string':
        if ( !_.isString(value) ) {
            return name + ' should be of type ' + constraint.type;
        }
        break;
    case 'integer':
        console.log('here1:' + value);
        console.log('here2:' + parseInt(value, 10));
        console.log('here3:' + (parseInt(value, 10) === value));
        if ( parseInt(value, 10) !== value ) {
            console.log('!!!!!!! WTF AM I DOING HERE!!!!!!!!');
            return name + ' should be of type ' + constraint.type;
        }
        else {
            console.log(name + 'integer is valid');
        }
        break;
    case 'float':
        if ( typeof value !== 'number' ) {
            return name + ' should be of type ' + constraint.type;
        }
        break;
    case 'boolean':
        if ( !_.isBoolean(value) ) {
            return name + ' should be of type ' + constraint.type;
        }
        break;
    case 'date':
        if ( !_.isDate(value) ) {
            return name + ' should be of type ' + constraint.type;
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
                return name + ' is required';
            }
        }
        else if ( r.type === 'min' ) {
            if ( value < r.value ) {
                return name + ' should be at least ' + r.value;
            }
        }
        else if ( r.type === 'max' ) {
            if ( value > r.value ) {
                return name + ' should be at most ' + r.value;
            }
        }
        else if ( r.type === 'minLen' ) {
            if ( value.length < r.len ) {
                return name + ' should be at least ' + r.len + ' characters';
            }
        }
        else if ( r.type === 'maxLen' ) {
            console.log('*** value=' + value);
            console.log('*** value.length=' + value.length);
            console.log('*** r.len=' + r.len);
            if ( value.length > r.len ) {
                console.log('*** dodgy');
                return name + ' should be at most ' + r.len + ' characters';
            }
        }
        else if ( r.type === 'matches' ) {
            console.log('Checking value ' + value + ' against regex');
            var m = value.match(r.regex);
            console.log('m:', m);
            if ( !value.match(r.regex) ) {
                console.log('Fails regex for name=' + name);
                return name + ' does not validate';
            }
        }
        else if ( r.type === 'isUrl' ) {
            console.log('Checking URL against a regex');
            // ToDo: http://someweblog.com/url-regular-expression-javascript-link-shortener/
            // From: http://stackoverflow.com/questions/8188645/javascript-regex-to-match-a-url-in-a-field-of-text
            // * (http|ftp|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?
            if ( !value.match(/^https?:\/\/[A-Za-z0-9][A-Za-z0-9-]*(\.[A-Za-z]+)+(:\d+)?(\/\S*)?$/) ) {
                console.log('Checking URL against a regex');
                return name + ' should be a URL and start with http:// or https://';
            }
        }
        else {
            throw new Error('Program Error: unknown type ' + r.type);
        }
    }

    // no error, so just return nothing
    return;
};

// --------------------------------------------------------------------------------------------------------------------

module.exports = exports = sound;

// --------------------------------------------------------------------------------------------------------------------
