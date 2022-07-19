import test from 'tape'
import sound from '../sound.js'

const conversions = {
  t: sound().isString().isRequired()._inject({ type: 'UNKNOWN' }),
}

const tests = [

  {
    name : 'Test of ._inject() so we can throw a program error',
    schema : conversions,
    params : {
      t : 'Blah!',
    },
  },

]

tests.forEach(function(v) {
  test(v.name, function(t) {
    try {
      sound.validate(v.params, v.schema)
      t.fail('What are we doing here?')
    }
    catch (err) {
      t.pass('We caught a throw')
      t.end()
    }
  })
})
