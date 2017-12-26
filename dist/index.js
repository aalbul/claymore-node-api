module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!************************!*\
  !*** multi ./index.js ***!
  \************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/aalbul/Documents/projects/self-dev/claymore-node-api/index.js */1);


/***/ }),
/* 1 */
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _claymoreApi = __webpack_require__(/*! ./src/claymore-api */ 2);

Object.defineProperty(exports, 'getStats', {
  enumerable: true,
  get: function get() {
    return _claymoreApi.getStats;
  }
});
Object.defineProperty(exports, 'getStatsJson', {
  enumerable: true,
  get: function get() {
    return _claymoreApi.getStatsJson;
  }
});
Object.defineProperty(exports, 'toStatsJson', {
  enumerable: true,
  get: function get() {
    return _claymoreApi.toStatsJson;
  }
});

/***/ }),
/* 2 */
/*!*****************************!*\
  !*** ./src/claymore-api.js ***!
  \*****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getStatsJson = exports.getStats = exports.toStatsJson = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _net = __webpack_require__(/*! net */ 3);

var _net2 = _interopRequireDefault(_net);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var request = JSON.stringify({
    id: 0,
    jsonrpc: '2.0',
    method: 'miner_getstat1'
}) + '\n';

var parseHashrate = function parseHashrate(hashrate) {
    return hashrate === 'off' ? 0 : Number(hashrate) / 1000;
};

var parseCardHashrates = function parseCardHashrates(hashrates) {
    return hashrates.split(';').map(parseHashrate);
};

var parseStats = function parseStats(stats) {
    var _stats$split = stats.split(';'),
        _stats$split2 = _slicedToArray(_stats$split, 3),
        totalHashrate = _stats$split2[0],
        successfulShares = _stats$split2[1],
        rejectedShares = _stats$split2[2];

    return {
        hashrate: parseHashrate(totalHashrate),
        shares: {
            successful: Number(successfulShares),
            rejected: Number(rejectedShares)
        }
    };
};

var parseCardTemperaturesFunSpeeds = function parseCardTemperaturesFunSpeeds(temperatureFanSpeeds) {
    var parsed = temperatureFanSpeeds.split(';');
    var grouped = [];
    while (parsed.length !== 0) {
        var temperature = parsed[0];
        var fanSpeed = parsed[1];
        parsed.splice(0, 2);
        grouped = [].concat(_toConsumableArray(grouped), [{ temperature: temperature, fanSpeed: fanSpeed }]);
    }
    return grouped;
};

var parseCoin = function parseCoin(stats, hashrates) {
    return Object.assign({}, parseStats(stats), { cardHashrates: parseCardHashrates(hashrates) });
};

var toStatsJson = exports.toStatsJson = function toStatsJson(result) {
    var positions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        version: 0,
        uptime: 1,
        ethashStats: 2,
        ethashHr: 3,
        dcoinStats: 4,
        dcoinhHr: 5,
        temperatureFanSpeeds: 6
    };

    return {
        claymoreVersion: result[positions.version],
        uptime: positions.uptime ? Number(result[positions.uptime]) : undefined,
        ethash: positions.ethashStats && positions.ethashHr ? parseCoin(result[positions.ethashStats], result[positions.ethashHr]) : undefined,
        dcoin: positions.dcoinStats && positions.dcoinhHr ? parseCoin(result[positions.dcoinStats], result[positions.dcoinhHr]) : undefined,
        sensors: positions.temperatureFanSpeeds ? parseCardTemperaturesFunSpeeds(result[positions.temperatureFanSpeeds]) : undefined
    };
};

var getStats = exports.getStats = function getStats(host, port) {
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5000;
    return new Promise(function (resolve, reject) {
        var socket = new _net2.default.Socket().on('connect', function () {
            socket.write(request);
            socket.setTimeout(timeout);
        }).on('timeout', function () {
            reject('Claymore didnt answer within ' + timeout + 'ms.');
            socket.destroy();
        }).on('data', function (data) {
            var result = JSON.parse(data.toString().trim()).result;
            resolve(result);
        }).on('error', function (e) {
            reject(e.message);
        });

        socket.connect(port, host);
    });
};

var getStatsJson = exports.getStatsJson = function getStatsJson(host, port) {
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5000;
    return getStats(host, port, timeout).then(toStatsJson);
};

/***/ }),
/* 3 */
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ })
/******/ ]);