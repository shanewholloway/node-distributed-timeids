# distributed-timeids

Distributed time id generation, loosely inspired by Twitter Snowflake.

Ids generated from the same source sort lexographically. Ids from seperate
sources sort lexographically by `(time division, source, counter)` where the
time division is bucketed by specified duration.


### Installation

```bash
$ npm install distributed-timeids
```

### Example

```javascript
let duration = 60*1000

const timeids = require('distributed-timeids')
let nextTimeId = timeids({template: "0000000-anExample-000", duration})
let nextTimeId_R = timeids()

console.log()
console.log(nextTimeId())
console.log(nextTimeId_R())
console.log(nextTimeId())
console.log(nextTimeId_R())
console.log()

setTimeout(() => {
    console.log()
    console.log(nextTimeId())
    console.log(nextTimeId_R())
    console.log(nextTimeId())
    console.log(nextTimeId_R())
    console.log()
  }, duration+1)

```

###### Output

```text
  08vvz6k-anExample-000
  0j6yi-$idhn$-0000
  08vvz6k-anExample-001
  0j6yi-$idhn$-0001


  08vvz6l-anExample-000
  0j6yi-$idhn$-0002
  08vvz6l-anExample-001
  0j6yi-$idhn$-0003
```

### Options

Common:

- **`template`**:
  a `'-'` separated string or array where the first and last
  items are used to pad the time divison and local counter.

- **`duration`**:
  defaulted to `60 * 1000` milliseconds (1 minute).
  Determines the "width" of the time division buckets.

- **`update(bodyId, timeDivision)`**:
  an optional function called for each new time divison.
  Return a new `bodyId` for subsequent time ids.

Less common:

- **`fmt_id`**:
  an optional function called to combine the elements into a string result.

- **`ts_base`**:
  defaulted to `new Date('2015-01-01T00:00:00').valueOf()`.
  Determines the starting point of the time division buckets.

- **`radix`**:
  defaulted to 36. Determines the base (radix) of the number formatting.
  (e.g. 10 is decimal, 16 is hex, 36 is the max for `value.toString(36)`)

- **`bodyId`**, **`digits`**, **`prefix`**, **`suffix`**, **`sep`**
  — …read the source, Luke!
