import timeids from 'distributed-timeids'

function main(console, done) {
  let duration = 100 // 60*1000

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

      if (done)
        done()
    }, duration+1)
}

main(console)
