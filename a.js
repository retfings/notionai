/* eslint-disable */
function exit(condition,time= 10  * 1000){
  if (condition){
    let p = new Promise(resolve => {
      setTimeout(resolve, time) 
    })
    p.then(() => {
      process.exit()
    })
  }
}

exit(true)


  let count = 0
  setInterval(() => {
    console.log(`${count}`)
    count++

  }, 1000)   
  
