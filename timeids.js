'use strict'

var z6 = '000000'
var z24 = z6+z6+z6+z6

module.exports = exports = timeIds
function timeIds(opt) {
  if (opt==null) opt = {}
  var bodyId = opt.bodyId || ''
  var sep = opt.sep != null ? opt.sep : '-'
  {
    var template = opt.template
    if ('string' === typeof template)
      template = template.split(sep)
    else if (!template)
      template = [z6,z6]
    else if (template.length<=1)
      template = [z6].concat(template, [z6])

    opt = Object.create(opt)
    opt.pad_ts = template.shift()
    opt.pad_c = template.pop()

    bodyId = template.join(sep) + bodyId
    if (!bodyId) bodyId = randomBodyId()
  }

  var td_next = timeDivisions(opt)
  var fmt_id = opt.fmt_id || function(tdiv, bodyId) {
    return [tdiv.sz_div, bodyId, tdiv.sz_c].join(sep) }

  if (opt.update)
    return function() {
      var tdiv = td_next()
      if (0 === tdiv.c)
        bodyId = opt.update(bodyId, tdiv) || bodyId
      return fmt_id(tdiv, bodyId) }

  return function() {
   return fmt_id(td_next(), bodyId) }
}


timeIds.randomBodyId = randomBodyId
function randomBodyId(opt) {
  if (opt==null) opt = {}
  var digits = opt.digits || 4, radix = opt.radix || 36
  var rVal = Math.random() * Math.pow(radix, digits)
  var pad_zeros = _curryPadNumber(radix, z24.slice(0, digits))
  return (opt.prefix || '$') + pad_zeros(rVal | 0) + (opt.suffix || '$')
}


timeIds.ts_base = new Date('2015-01-01T00:00:00').valueOf()
timeIds.timeDivisions = timeDivisions
function timeDivisions(opt) {
  if (opt==null) opt = {}
  var ts0 = opt.ts_base || timeIds.ts_base
  var fmt_ts = _curryPadNumber(opt.radix || 36, opt.pad_ts || z6)
  var fmt_c  = _curryPadNumber(opt.radix || 36, opt.pad_c  || z6)
  var duration = opt.duration || 60*1000

  var ts_div = function(ts) {
    var div = Math.floor((ts - ts0) / duration)
    var t0 = div * duration + ts0
    var t1 = t0 + duration
    return {t0: t0, t1: t1, div: div, sz_div: fmt_ts(div)} }

  var tip = {}, sz_c0
  return function() {
    var now = Date.now()
    // first pass: tip.t1 is undefined, and (undefined <= now number) evaluates **false**
    if (tip.t1 > now) {
      var c=tip.c+1, sz_c=fmt_c(c)
      // throw if sz_c has rolled over
      if (sz_c === sz_c0)
        throw new Error("Timeid rollover", {sz_c:sz_c, sz_c0:sz_c0, c:c, tip:tip})

      tip.c = c; tip.sz_c = sz_c
      return tip
    }
    // otherwise, refresh

    tip = ts_div(now)
    sz_c0 = fmt_c(tip.c = 0)
    tip.sz_c = sz_c0
    return tip
  }
}


timeIds._curryPadNumber = _curryPadNumber
function _curryPadNumber(radix, pad) {
  var pre=pad+"", len=pre.length
  return function(v) {
    var sz = v.toString(radix)
    return (pre+sz).substr(-len) }
}

