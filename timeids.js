const z6 = '000000', z24 = z6+z6+z6+z6
export const _ts_base = new Date('2015-01-01T00:00:00.000Z').valueOf()

export default timeIds
export function timeIds(opt) {
  if (null == opt) opt = {}
  let bodyId = opt.bodyId || ''
  let sep = null != opt.sep ? opt.sep : '-'
  {
    let template = opt.template
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

  let td_next = timeDivisions(opt)
  let fmt_id = opt.fmt_id ||
    ((tdiv, bodyId) => [tdiv.sz_div, bodyId, tdiv.sz_c].join(sep))

  return null == opt.update
    ? () => fmt_id(td_next(), bodyId)
    : () => {
        let tdiv = td_next()
        if (0 === tdiv.c)
          bodyId = opt.update(bodyId, tdiv) || bodyId
        return fmt_id(tdiv, bodyId) }
}


export function randomBodyId(opt) {
  if (null == opt) opt = {}
  let digits = opt.digits || 4, radix = opt.radix || 36
  let rVal = Math.random() * Math.pow(radix, digits)
  let pad_zeros = _curryPadNumber(radix, z24.slice(0, digits))
  return (opt.prefix || '$') + pad_zeros(rVal | 0) + (opt.suffix || '$')
}


export function timeDivisions(opt) {
  if (null == opt) opt = {}
  let ts0 = opt.ts_base || _ts_base
  let fmt_ts = _curryPadNumber(opt.radix || 36, opt.pad_ts || z6)
  let fmt_c  = _curryPadNumber(opt.radix || 36, opt.pad_c  || z6)
  let duration = opt.duration || 60*1000

  let ts_div = ts => {
    let div = Math.floor((ts - ts0) / duration)
    let t0 = div * duration + ts0
    return {
      t0, t1: t0 + duration,
      div, sz_div: fmt_ts(div)
    } }

  let tip = {}, sz_c0
  return () => {
    let now = Date.now()
    // first pass: tip.t1 is undefined, and (undefined <= now number) evaluates **false**
    if (tip.t1 > now) {
      let c=tip.c+1, sz_c=fmt_c(c)
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


export function _curryPadNumber(radix, pad) {
  pad += ""
  return v => (pad + v.toString(radix)).substr(-pad.length)
}

