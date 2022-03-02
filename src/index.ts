import {Doser} from "./doser";
import {Doser2} from "./doser2";

// Tutorial: https://khalilstemmler.com/blogs/typescript/node-starter-project/
// https://blog.appsignal.com/2022/01/19/how-to-set-up-a-nodejs-project-with-typescript.html

// const args = process.argv;
// console.log('Script started: ', args);
let timeout = undefined;

function start() {
  const doser = new Doser2(true, 10)//32

  console.log('Started DDOSing...')
  doser.start(); //Start DDOSing
}

// function start() {
//   const doser = new Doser(true, 10)//32
//   doser.listen('atack', (data) => console.log("Attack: ", data.log))
//   doser.listen('error', (data) => console.log("Error: ", data.log))
//
//   // doser.forceProxy(true); // Use proxy to save the server
//   // doser.setWorkersCount(32); // Count of workers
//   console.log('Started DDOSing...')
//   doser.start(); //Start DDOSing
//
//
//   // Turn this script off after some time
//   // If this is commented out then script will work forever
//   // timeout = setTimeout(() => {
//   //   doser.stop();
//   //   console.log('Stopped DDOSing...')
//   // }, 15000)
// }

start();
