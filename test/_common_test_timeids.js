import tap from 'tap-lite-tester'

export default test_timeids_module
export function test_timeids_module(timeids) {

  tap.test('smoke', t => t.ok(timeids))

  tap.test.cb('example', t => {
    const mock = {log: obj => obj && t.ok(true) }
    t.plan(4 * 2)
    require('../example.js')
      .main(mock, t.done)
  })

  tap.test('full', t => {
    const bodyIdTransforms = {'a':'b', 'b':'c', 'c': 'a', 'z':'a'}
    let template = '########-x-00'
    let nextTimeId = timeids({template, duration: 100,
      update: bodyId => bodyIdTransforms[bodyId] || 'z' })

    let outer = []
    const addBlock = n => {
      let r = []
      outer.push(r)
      for(let i=0; i<n; i++)
        r.push(nextTimeId()) }

    setTimeout(() => addBlock(10), 0)
    setTimeout(() => addBlock(5), 150)
    setTimeout(() => addBlock(40), 200)
    setTimeout(() => addBlock(35), 250)
    setTimeout(() => addBlock(40), 260)

    t.plan(12)
    return new Promise(rs=>setTimeout(rs, 300))
      .then(()=> {
        let first = outer[0][0].split('-') 
        let last = outer.slice(-1)[0].slice(-1)[0].split('-') 

        // time ids should be ordered and different
        t.ok(first[0] < last[0])
        // first index should be 'z' according to update plan
        t.equal('z', first[1])
        // ending index should be any of 'abc'
        t.ok('abc'.match(last[1]))
      })
      .then(()=> {
        // we should have the requested number of items for each list
        t.deepEqual(outer.map(r=>r.length), [10,5,40,35,40])

        let ans = new Set()
        outer.forEach(r => r.forEach(m => ans.add(m.length)))
        t.deepEqual([template.length], Array.from(ans))
      })
      .then(()=> {
        // all sub lists should be ordered
        for(let r of outer)
          t.ok(isOrdered(r))

        // first element of each sub list should be ordered
        t.ok(isOrdered(outer.map(r=>r[0])))
        // last element of each sub list should be ordered
        t.ok(isOrdered(outer.map(r=>r[r.length-1])))
      })

    function isOrdered(lst) {
      for(let i=1; i<lst.length; i++)
        if (lst[i-1]>lst[i]) return false
      return true }

  })

  return tap.finish()
}
