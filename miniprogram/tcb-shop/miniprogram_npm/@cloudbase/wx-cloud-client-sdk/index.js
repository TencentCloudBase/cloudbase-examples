module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1727109350336, function(require, module, exports) {


/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, [])).next());
    });
}

function __generator(thisArg, body) {
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
}

var WxCloudSDKError = /** @class */ (function (_super) {
    __extends(WxCloudSDKError, _super);
    function WxCloudSDKError(message, extra) {
        var _this = _super.call(this, message) || this;
        _this.name = 'WxCloudSDKError';
        _this.code = extra === null || extra === void 0 ? void 0 : extra.code;
        _this.requestId = extra === null || extra === void 0 ? void 0 : extra.requestId;
        _this.originError = extra === null || extra === void 0 ? void 0 : extra.originError;
        return _this;
    }
    return WxCloudSDKError;
}(Error));

/**
 * 获取全局对象 window
 *  小程序中可用, 但小程序中对象信息残缺, 无法访问 navigator 对象, ua 信息也无意义
 */
function getGlobalObj() {
    // @ts-ignore
    return (typeof window !== 'undefined' && window) || (typeof globalThis !== 'undefined' && globalThis);
}
/** 获取referrer 信息, 担心小程序中报错, 故catch */
function getReferrer() {
    try {
        var globalObj = getGlobalObj();
        if (!globalObj)
            return;
        // 浏览器中
        // @ts-ignore
        if (typeof wx === 'undefined') {
            // @ts-ignore
            return getGlobalObj().location.href;
        }
        // 当前页面路由
        // @ts-ignore
        return globalObj.__wxRoute;
    }
    catch (_a) { }
}
/** 获取用户UA, 小程序中使用 getSystemInfo 替代 */
function getUserAgent() {
    var globalObj = getGlobalObj();
    // @ts-ignore
    if (globalObj === null || globalObj === void 0 ? void 0 : globalObj.navigator)
        return globalObj.navigator.userAgent;
    // 微信小程序
    // @ts-ignore
    if (typeof wx !== 'undefined' && wx.getSystemInfo) {
        var ua_1;
        // 同步接口
        // @ts-ignore
        wx.getSystemInfo({
            success: function (res) {
                if (!res)
                    return;
                ua_1 = ['brand', 'model', 'version', 'system', 'platform', 'SDKVersion', 'language']
                    .map(function (k) { return "".concat(k, ": ").concat(res[k]); })
                    .join(', ');
            }
        });
        return ua_1;
    }
}
var VERSION = "1.2.1";

var callDataSource = function (_a) {
    var dataSourceName = _a.dataSourceName, methodName = _a.methodName, params = _a.params, realMethodName = _a.realMethodName, callFunction = _a.callFunction, _b = _a.envType, envType = _b === void 0 ? 'prod' : _b, mode = _a.mode;
    return __awaiter(void 0, void 0, void 0, function () {
        var result, response, requestId, error_1;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    result = {
                        data: {},
                        requestId: ''
                    };
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, callFunction({
                            name: 'lowcode-datasource',
                            data: {
                                dataSourceName: dataSourceName,
                                methodName: methodName,
                                params: params,
                                userAgent: getUserAgent(),
                                referrer: getReferrer(),
                                'x-sdk-version': VERSION,
                                /**
                                 * todo 移除此字段
                                 */
                                envType: envType,
                                mode: mode
                            }
                        })];
                case 2:
                    response = _e.sent();
                    requestId = ((_c = response === null || response === void 0 ? void 0 : response.result) === null || _c === void 0 ? void 0 : _c.requestId) || (response === null || response === void 0 ? void 0 : response.requestId) || (response === null || response === void 0 ? void 0 : response.requestID);
                    if (response === null || response === void 0 ? void 0 : response.result.code) {
                        throw new WxCloudSDKError("\u3010\u9519\u8BEF\u3011".concat(response === null || response === void 0 ? void 0 : response.result.message, "\n\u3010\u64CD\u4F5C\u3011\u8C03\u7528 models.").concat(dataSourceName ? "".concat(dataSourceName, ".") : "").concat(realMethodName, "\n\u3010\u9519\u8BEF\u7801\u3011").concat(response === null || response === void 0 ? void 0 : response.result.code, "\n\u3010\u8BF7\u6C42ID\u3011").concat(requestId || 'N/A'), {
                            code: response === null || response === void 0 ? void 0 : response.result.code,
                            requestId: requestId
                        });
                    }
                    else {
                        result.data = ((_d = response === null || response === void 0 ? void 0 : response.result) === null || _d === void 0 ? void 0 : _d.data) || {};
                        result.requestId = requestId;
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _e.sent();
                    if (error_1.name === 'WxCloudSDKError') {
                        throw error_1;
                    }
                    else {
                        console.log(error_1);
                        throw new WxCloudSDKError("\u3010\u9519\u8BEF\u3011".concat(error_1.message, "\n      \u3010\u64CD\u4F5C\u3011\u8C03\u7528 models.").concat(dataSourceName ? "".concat(dataSourceName, ".") : "").concat(realMethodName, "\n      \u3010\u8BF7\u6C42ID\u3011N/A"), {
                            code: 'UnknownError',
                            originError: error_1
                        });
                    }
                case 4: return [2 /*return*/, result];
            }
        });
    });
};
var runMysqlCommand = function (_a) {
    var sql = _a.sql, params = _a.params, config = _a.config, callFunction = _a.callFunction, _b = _a.unsafe, unsafe = _b === void 0 ? false : _b;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_c) {
            return [2 /*return*/, callDataSource({
                    realMethodName: '$runSQL',
                    methodName: 'callWedaApi',
                    params: {
                        action: 'RunMysqlCommand',
                        data: {
                            sqlTemplate: sql,
                            config: config,
                            parameter: unsafe
                                ? ''
                                : Object.entries(params || {}).reduce(function (list, _a) {
                                    var key = _a[0], value = _a[1];
                                    if (value !== undefined) {
                                        var type = "OBJECT" /* EQUERY_PARAM_TYPE.OBJECT */;
                                        var typeofValue = typeof value;
                                        switch (typeofValue) {
                                            case 'boolean': {
                                                type = "BOOLEAN" /* EQUERY_PARAM_TYPE.BOOLEAN */;
                                                break;
                                            }
                                            case 'number': {
                                                type = "NUMBER" /* EQUERY_PARAM_TYPE.NUMBER */;
                                                break;
                                            }
                                            case 'string': {
                                                type = "STRING" /* EQUERY_PARAM_TYPE.STRING */;
                                                break;
                                            }
                                            default: {
                                                if (Array.isArray(value)) {
                                                    type = "ARRAY" /* EQUERY_PARAM_TYPE.ARRAY */;
                                                }
                                                else {
                                                    type = "OBJECT" /* EQUERY_PARAM_TYPE.OBJECT */;
                                                }
                                            }
                                        }
                                        list.push({
                                            key: key,
                                            type: type,
                                            value: type === "STRING" /* EQUERY_PARAM_TYPE.STRING */ ? value : JSON.stringify(value)
                                        });
                                    }
                                    return list;
                                }, []) || []
                        }
                    },
                    callFunction: callFunction,
                    mode: 'sdk'
                })];
        });
    });
};

var CRUD_METHODS = {
    create: {
        methodName: 'wedaCreateV2'
    },
    createMany: {
        methodName: 'wedaBatchCreateV2'
    },
    update: {
        methodName: 'wedaUpdateV2'
    },
    upsert: {
        methodName: 'wedaUpsertV2'
    },
    updateMany: {
        methodName: 'wedaBatchUpdateV2'
    },
    "delete": {
        methodName: 'wedaDeleteV2'
    },
    deleteMany: {
        methodName: 'wedaBatchDeleteV2'
    },
    get: {
        methodName: 'wedaGetItemV2',
        defaultParams: {
            filter: {
                where: {}
            },
            select: {
                $master: true
            }
        }
    },
    list: {
        methodName: 'wedaGetRecordsV2',
        defaultParams: {
            filter: {
                where: {}
            },
            select: {
                $master: true
            }
        }
    }
};
var generateClientByDataSourceName = function (dataSourceName, callFunction) {
    var client = new Proxy({}, {
        get: function (target, methodName) {
            var operation = CRUD_METHODS[methodName];
            if (!operation) {
                var error = new Error("\u4E0D\u652F\u6301\u7684\u64CD\u4F5C: ".concat(methodName));
                throw new WxCloudSDKError(error.message || 'Unknown error occurred', {
                    originError: error,
                    code: 'NotSupported',
                    requestId: 'N/A'
                });
            }
            return function (params) { return __awaiter(void 0, void 0, void 0, function () {
                var effectiveParams, rawData, result, dataKey;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            effectiveParams = __assign(__assign({}, (operation.defaultParams || {})), (params || {}));
                            return [4 /*yield*/, callDataSource({
                                    callFunction: callFunction,
                                    dataSourceName: dataSourceName,
                                    methodName: operation.methodName,
                                    realMethodName: methodName,
                                    params: effectiveParams,
                                    envType: params === null || params === void 0 ? void 0 : params.envType
                                })];
                        case 1:
                            rawData = _b.sent();
                            result = { data: {} };
                            dataKey = operation.responseKey;
                            result.data = dataKey ? (_a = rawData === null || rawData === void 0 ? void 0 : rawData.data) === null || _a === void 0 ? void 0 : _a[dataKey] : rawData === null || rawData === void 0 ? void 0 : rawData.data;
                            return [2 /*return*/, result];
                    }
                });
            }); };
        }
    });
    return client;
};
// 使用 TypeScript 的 Proxy 来定义一个动态的客户端
var generateClient = function (callFunction) {
    var rawQueryClient = {
        $runSQL: function (sql, params, config) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, runMysqlCommand({
                                sql: sql,
                                params: params,
                                config: __assign(__assign({}, config), { preparedStatements: true }),
                                callFunction: callFunction
                            })];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, res];
                    }
                });
            });
        },
        $runSQLRaw: function (sql, config) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, runMysqlCommand({
                                sql: sql,
                                params: [],
                                config: __assign(__assign({}, config), { preparedStatements: false }),
                                callFunction: callFunction
                            })];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, res];
                    }
                });
            });
        }
    };
    return new Proxy({}, {
        get: function (target, prop) {
            if (typeof prop === 'string') {
                if (rawQueryClient.hasOwnProperty(prop)) {
                    return rawQueryClient[prop];
                }
                // 返回一个函数，这个函数接受任意参数并返回一个 Promise
                return generateClientByDataSourceName(prop, callFunction);
            }
        }
    });
};

function init(cloud) {
    if (!cloud) {
        throw new Error('cloud is required');
    }
    if (!cloud.callFunction) {
        throw new Error('cloud.callFunction is required');
    }
    var OrmClientImpl = generateClient(cloud.callFunction.bind(cloud));
    cloud.models = OrmClientImpl;
    return cloud;
}

exports.init = init;

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1727109350336);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map