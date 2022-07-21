// --------------------------------------------------------------------------------------------------------------------
//
// sound - Make sure your data is sound! Schema generator, converter and validation library for Node.js.
//
// Copyright (c) 2013 Andrew Chilton
// - andychilton@gmail.com
// - https://chilts.org/
//
// License: http://chilts.mit-license.org/2013/
//
// --------------------------------------------------------------------------------------------------------------------

// npm
import _ from 'lodash'
import isemail from 'isemail'

const valid = {
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
}

const T_IS_STRING        = 'isString'
const T_IS_INTEGER       = 'isInteger'
const T_IS_FLOAT         = 'isFloat'
const T_IS_BOOLEAN       = 'isBoolean'
const T_IS_DATE          = 'isDate'
const T_IS_OBJECT        = 'isObject'
const T_IS_ARRAY         = 'isArray'

const T_IS_URL           = 'isUrl'
const T_IS_DOMAIN        = 'isDomain'
const T_IS_EMAIL_ADDRESS = 'isEmailAddress'
const T_IS_TOKEN         = 'isToken'
const T_IS_MATCH         = 'isMatch'
const T_IS_ENUM          = 'isEnum'

const T_TO_TRIM          = 'toTrim'
const T_TO_LOWER_CASE    = 'toLowerCase'
const T_TO_UPPER_CASE    = 'toUpperCase'
const T_TO_REPLACE       = 'toReplace'

const T_IS_EQUAL         = 'isEqual'
const T_IS_NOT_EMPTY     = 'isNotEmpty'
const T_IS_MIN_LEN       = 'isMinLen'
const T_IS_MAX_LEN       = 'isMaxLen'
const T_IS_MIN_VAL       = 'isMinVal'
const T_IS_MAX_VAL       = 'isMaxVal'
const T_IS_GREATER_THAN  = 'isGreaterThan'
const T_IS_LESS_THAN     = 'isLessThan'

const T_TO_STRING        = 'toString'
const T_TO_INTEGER       = 'toInteger'
const T_TO_FLOAT         = 'toFloat'
const T_TO_BOOLEAN       = 'toBoolean'

// --------------------------------------------------------------------------------------------------------------------

const Constraint = function(name) {
  this._name = name
  this._required = false
  this._requiredMsg = undefined
  this._default = undefined
  this.rules = []
  return this
}

Constraint.prototype.setName = function(_name) {
  this._name = _name
  return this
}

Constraint.prototype.isRequired = function(msg) {
  this._required = true
  this._requiredMsg = msg
  return this
}

Constraint.prototype.hasDefault = function(val) {
  this._default = val
  return this
}

// --------------------------------------------------------------------------------------------------------------------
// validations

Constraint.prototype.isString = function(msg) {
  this.rules.push({
    type : T_IS_STRING,
    msg  : msg,
  })
  return this
}

Constraint.prototype.isInteger = function(msg) {
  this.rules.push({
    type : T_IS_INTEGER,
    msg  : msg,
  })
  return this
}

Constraint.prototype.isFloat = function(msg) {
  this.rules.push({
    type : T_IS_FLOAT,
    msg  : msg,
  })
  return this
}

Constraint.prototype.isBoolean = function(msg) {
  this.rules.push({
    type : T_IS_BOOLEAN,
    msg  : msg,
  })
  return this
}

Constraint.prototype.isDate = function(msg) {
  this.rules.push({
    type : T_IS_DATE,
    msg  : msg,
  })
  return this
}

Constraint.prototype.isObject = function(msg) {
  this.rules.push({
    type : T_IS_OBJECT,
    msg  : msg,
  })
  return this
}

Constraint.prototype.isArray = function(msg) {
  this.rules.push({
    type : T_IS_ARRAY,
    msg  : msg,
  })
  return this
}

Constraint.prototype.isEqual = function(value, msg) {
  this.rules.push({
    type : T_IS_EQUAL,
    value : value,
    msg  : msg,
  })
  return this
}

Constraint.prototype.isLessThan = function(value, msg) {
  this.rules.push({
    type  : T_IS_LESS_THAN,
    value : value,
    msg   : msg,

  })
  return this
}

Constraint.prototype.isGreaterThan = function(value, msg) {
  this.rules.push({
    type  : T_IS_GREATER_THAN,
    value : value,
    msg   : msg,

  })
  return this
}

Constraint.prototype.isMinVal = function(value, msg) {
  this.rules.push({
    type  : T_IS_MIN_VAL,
    value : value,
    msg   : msg,

  })
  return this
}

Constraint.prototype.isMaxVal = function(value, msg) {
  this.rules.push({
    type  : T_IS_MAX_VAL,
    value : value,
    msg   : msg,
  })
  return this
}

Constraint.prototype.isNotEmpty = function(msg) {
  this.rules.push({
    type : T_IS_NOT_EMPTY,
    msg  : msg,
  })
  return this
}

Constraint.prototype.isMinLen = function(len, msg) {
  this.rules.push({
    type : T_IS_MIN_LEN,
    len  : len,
    msg  : msg,
  })
  return this
}

Constraint.prototype.isMaxLen = function(len, msg) {
  this.rules.push({
    type : T_IS_MAX_LEN,
    len  : len,
    msg  : msg,
  })
  return this
}

Constraint.prototype.isMatch = function(regex, msg) {
  this.rules.push({
    type  : T_IS_MATCH,
    regex : regex,
    msg   : msg,
  })
  return this
}

Constraint.prototype.isEnum = function(values, msg) {
  const value = {}
  values.forEach(v => value[v] = true)
  this.rules.push({
    type   : T_IS_ENUM,
    values : values,
    value  : value,
    msg    : msg,
  })
  return this
}

Constraint.prototype.isUrl = function(msg) {
  this.rules.push({
    type : T_IS_URL,
    msg  : msg,
  })
  return this
}

Constraint.prototype.isDomain = function(msg) {
  this.rules.push({
    type : T_IS_DOMAIN,
    msg  : msg,
  })
  return this
}

Constraint.prototype.isEmailAddress = function(msg) {
  this.rules.push({
    type : T_IS_EMAIL_ADDRESS,
    msg  : msg,
  })
  return this
}

Constraint.prototype.isToken = function(msg) {
  this.rules.push({
    type : T_IS_TOKEN,
    msg  : msg,
  })
  return this
}

Constraint.prototype._inject = function(item) {
  this.rules.push(item)
  return this
}

// --------------------------------------------------------------------------------------------------------------------
// conversions

Constraint.prototype.toTrim = function() {
  this.rules.push({
    type : T_TO_TRIM,
  })
  return this
}

Constraint.prototype.toLowerCase = function() {
  this.rules.push({
    type : T_TO_LOWER_CASE,
  })
  return this
}

Constraint.prototype.toUpperCase = function() {
  this.rules.push({
    type : T_TO_UPPER_CASE,
  })
  return this
}

Constraint.prototype.toReplace = function(a, b) {
  this.rules.push({
    type : T_TO_REPLACE,
    a : a,
    b : b,
  })
  return this
}

// --------------------------------------------------------------------------------------------------------------------
// coercions

Constraint.prototype.toString = function(msg) {
  this.rules.push({
    type : T_TO_STRING,
    msg  : msg,
  })
  return this
}

Constraint.prototype.toInteger = function(msg) {
  this.rules.push({
    type : T_TO_INTEGER,
    msg  : msg,
  })
  return this
}

Constraint.prototype.toFloat = function(msg) {
  this.rules.push({
    type : T_TO_FLOAT,
    msg  : msg,
  })
  return this
}

Constraint.prototype.toBoolean = function(msg) {
  this.rules.push({
    type : T_TO_BOOLEAN,
    msg  : msg,
  })
  return this
}

// --------------------------------------------------------------------------------------------------------------------
// sound itself (for the constraints) and it's only function for validation

const sound = function(name) {
  return new Constraint(name)
}

sound.validate = function(arg, schema) {
  const val = {}
  const err = {}
  let ok = true

  // go through each property of the schema (we ignore all others)
  const keys = Object.keys(schema)
  keys.forEach(function(key) {
    // validate the arg against it's own constraints in the schema
    // Note: sound.validateParam(name, value, schema, fn)
    const validation = validateParam(schema[key]._name || key, arg[key], schema[key])
    if ( validation.ok ) {
      // don't copy over nulls which appear if the arg doesn't have it
      if (typeof validation.val !== 'undefined' ) {
        val[key] = validation.val
      }
    }
    else {
      ok = false
      err[key] = validation.err
    }
  })

  return {
    ok  : ok,
    arg : arg,
    val : val,
    err : err,
  }
}

const validateParam = function(name, value, constraint) {
  // first thing to do is see if this param is empty, has a default, and is required
  if ( _.isUndefined(value) || _.isNull(value) || value === '' ) {
    // check to see if a default was provided and set it
    if ( _.isUndefined(constraint._default) ) {
      // no default provided, now check if it is required
      if ( constraint._required ) {
        // yes, required, so this fails
        return {
          ok  : false,
          err : constraint._requiredMsg || name + ' is required',
        }
      }
      else {
        // not required, so this is okay
        return {
          ok  : true,
        }
      }
    }
    else {
      // we have a default, so set the value for later checking
      value = constraint._default
    }
  }
  // else, we have a value, so keep checking things

  // now, loop through all the constraints
  for ( let i = 0; i < constraint.rules.length; i++ ) {
    const r = constraint.rules[i]

    // check all of the different constraints
    if ( r.type === T_IS_STRING ) {
      if ( !_.isString(value) ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be a string',
        }
      }
    }
    else if ( r.type === T_IS_INTEGER ) {
      if ( parseInt(value, 10) !== value ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be an integer',
        }
      }
    }
    else if ( r.type === T_IS_FLOAT ) {
      if ( typeof value !== 'number' ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be a float',
        }
      }
    }
    else if ( r.type === T_IS_BOOLEAN ) {
      if ( !_.isBoolean(value) ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be a boolean',
        }
      }
    }
    else if ( r.type === T_IS_DATE ) {
      if ( !_.isDate(value) ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be a date',
        }
      }
    }
    else if ( r.type === T_IS_OBJECT ) {
      if ( !_.isPlainObject(value) ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be an object',
        }
      }
    }
    else if ( r.type === T_IS_ARRAY ) {
      if ( !_.isArray(value) ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be an array',
        }
      }
    }
    else if ( r.type === T_IS_EQUAL ) {
      if ( value !== r.value ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be ' + r.value,
        }
      }
    }
    else if ( r.type === T_IS_GREATER_THAN ) {
      if ( value <= r.value ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be greater than ' + r.value,
        }
      }
    }
    else if ( r.type === T_IS_LESS_THAN ) {
      if ( value >= r.value ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be less than ' + r.value,
        }
      }
    }
    else if ( r.type === T_IS_MIN_VAL ) {
      if ( value < r.value ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be at least ' + r.value,
        }
      }
    }
    else if ( r.type === T_IS_MAX_VAL ) {
      if ( value > r.value ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be at most ' + r.value,
        }
      }
    }
    else if ( r.type === T_IS_NOT_EMPTY ) {
      if ( value.trim() === '' ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be provided',
        }
      }
    }
    else if ( r.type === T_IS_MIN_LEN ) {
      if ( value.length < r.len ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be at least ' + r.len + ' characters',
        }
      }
    }
    else if ( r.type === T_IS_MAX_LEN ) {
      if ( value.length > r.len ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be at most ' + r.len + ' characters',
        }
      }
    }
    else if ( r.type === T_IS_MATCH ) {
      if ( !value.match(r.regex) ) {
        return {
          ok  : false,
          err : r.msg || name + ' is not valid',
        }
      }
    }
    else if ( r.type === T_IS_ENUM ) {
      if ( !(value in r.value) ) {
        return {
          ok  : false,
          err : r.msg || name + ' is not a valid value',
        }
      }
    }
    else if ( r.type === T_IS_URL ) {
      // ToDo: http://someweblog.com/url-regular-expression-javascript-link-shortener/
      // From: http://stackoverflow.com/questions/8188645/javascript-regex-to-match-a-url-in-a-field-of-text
      // * (http|ftp|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?
      if ( !value.match(/^https?:\/\/[A-Za-z0-9][A-Za-z0-9-]*(\.[A-Za-z]+)+(:\d+)?(\/\S*)?$/) ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be a URL and start with http:// or https://',
        }
      }
    }
    else if ( r.type === T_IS_DOMAIN ) {
      // Copy part of the above T_IS_URL
      if ( !value.match(/^([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/) ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be a FQDN such as example.com or my.example.org',
        }
      }
    }
    else if ( r.type === T_IS_EMAIL_ADDRESS ) {
      // From npm.im/isemail, we're going to include TLD weirdnesses, but not quoted usernames or address literals.
      //
      // rfc5321TLD: 9,
      // rfc5321TLDNumeric: 10,
      // rfc5321QuotedString: 11,
      // rfc5321AddressLiteral: 12,
      if ( isemail.validate(value, { errorLevel: 10 }) !== 0 ) {
        return {
          ok  : false,
          err : r.msg || name + ' should be an Email Address',
        }
      }
    }
    else if ( r.type === T_IS_TOKEN ) {
      // Tokens are like URI segments. Lowercase letters, numbers and dashes.
      if ( !value.match(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/) ) {
        return {
          ok  : false,
          err : r.msg || name + ' should start and end with letters/numbers and contain only lowercase letters, numbers and dashes',
        }
      }
    }
    else if ( r.type === T_TO_TRIM ) {
      value = value.replace(/^\s+|\s+$/g, '')
    }
    else if ( r.type === T_TO_LOWER_CASE ) {
      value = value.toLowerCase()
    }
    else if ( r.type === T_TO_UPPER_CASE ) {
      value = value.toUpperCase()
    }
    else if ( r.type === T_TO_REPLACE ) {
      value = value.replace(r.a, r.b)
    }
    else if ( r.type === T_TO_STRING ) {
      value = String(value)
    }
    else if ( r.type === T_TO_INTEGER ) {
      value = parseInt(value, 10)
      if ( Number.isNaN(value) ) {
        return {
          ok  : false,
          err : r.msg || name + ' could not be converted to an integer',
        }
      }
    }
    else if ( r.type === T_TO_FLOAT ) {
      value = parseFloat(value)
      if ( Number.isNaN(value) ) {
        return {
          ok  : false,
          err : r.msg || name + ' could not be converted to a float',
        }
      }
    }
    else if ( r.type === T_TO_BOOLEAN ) {
      if ( _.isString(value) ) {
        if ( value.toLowerCase() in valid.boolean ) {
          value = valid.boolean[value.toLowerCase()]
        }
        else {
          // do nothing, the user needs to validate their input prior to this conversion
          return {
            ok  : false,
            err : r.msg || name + ' is not a recognised value when converting to boolean',
          }
        }
      }
      else if ( _.isNumber(value) ) {
        value = !(value == 0)
      }
      else {
        // do nothing, the user needs to validate their input prior to this conversion
        return {
          ok  : false,
          err : r.msg || name + ' value should be a string or integer when converting to boolean',
        }
      }
    }
    else {
      throw new Error('Program Error: unknown type ' + r.type)
    }
  }

  // no error, so just return nothing
  return {
    ok  : true,
    val : value,
  }
}

// --------------------------------------------------------------------------------------------------------------------

export default sound

// --------------------------------------------------------------------------------------------------------------------
