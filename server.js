#!/usr/bin/env node
(function () {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var IO = function () {
  function IO() {
    classCallCheck(this, IO);
  }

  createClass(IO, [{
    key: "isToOpen",
    value: function isToOpen() {}
  }, {
    key: "isToJoin",
    value: function isToJoin() {}
  }, {
    key: "isToTransmitToOpener",
    value: function isToTransmitToOpener() {}
  }, {
    key: "isToTransmitToJoining",
    value: function isToTransmitToJoining() {}
  }]);
  return IO;
}();

var SigverError = function () {
  function SigverError(code, message) {
    classCallCheck(this, SigverError);

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = code[0] + ': ' + message;
    this.code = code[1];
  }

  createClass(SigverError, null, [{
    key: 'MESSAGE_FORMAT_ERROR',
    get: function get() {
      return ['MESSAGE_FORMAT_ERROR', 4000];
    }
  }, {
    key: 'MESSAGE_UNKNOWN',
    get: function get() {
      return ['MESSAGE_UNKNOWN', 4001];
    }
  }, {
    key: 'KEY_TOO_LONG',
    get: function get() {
      return ['KEY_TOO_LONG', 4010];
    }
  }, {
    key: 'KEY_FORMAT_ERROR',
    get: function get() {
      return ['KEY_FORMAT_ERROR', 4011];
    }
  }, {
    key: 'KEY_FOR_OPEN_EXISTS',
    get: function get() {
      return ['KEY_EXISTS', 4012];
    }
  }, {
    key: 'KEY_FOR_JOIN_UNKNOWN',
    get: function get() {
      return ['KEY_UNKNOWN', 4013];
    }
  }, {
    key: 'OPENER_NO_LONGER_AVAILABLE',
    get: function get() {
      return ['OPENER_NO_LONGER_AVAILABLE', 4020];
    }
  }, {
    key: 'JOINING_NO_LONGER_AVAILABLE',
    get: function get() {
      return ['JOINING_NO_LONGER_AVAILABLE', 4021];
    }
  }, {
    key: 'TRANSMIT_BEFORE_OPEN',
    get: function get() {
      return ['TRANSMIT_BEFORE_OPEN', 4022];
    }
  }, {
    key: 'TRANSMIT_BEFORE_JOIN',
    get: function get() {
      return ['TRANSMIT_BEFORE_JOIN', 4023];
    }
  }]);
  return SigverError;
}();

var KEY_LENGTH_LIMIT = 512;

var IOJsonString = function (_IO) {
  inherits(IOJsonString, _IO);

  function IOJsonString(data) {
    classCallCheck(this, IOJsonString);

    var _this = possibleConstructorReturn(this, (IOJsonString.__proto__ || Object.getPrototypeOf(IOJsonString)).call(this));

    try {
      _this.msg = JSON.parse(data);
    } catch (err) {
      throw new SigverError(SigverError.MESSAGE_FORMAT_ERROR, 'The message is not a JSON string');
    }
    _this._key = undefined;
    _this.open = false;
    _this.transmitToOpener = false;
    _this.join = false;
    _this.transmitToJoining = false;
    var keysNb = Object.keys(_this.msg).length;
    if ('open' in _this.msg && keysNb === 1) {
      _this._key = _this.msg.open;
      _this.validateKey();
      _this.open = true;
    } else if ('join' in _this.msg && keysNb === 1) {
      _this._key = _this.msg.join;
      _this.validateKey();
      _this.join = true;
    } else if ('data' in _this.msg && keysNb === 1) {
      _this.transmitToOpener = true;
    } else if ('id' in _this.msg && 'data' in _this.msg && keysNb === 2) {
      if (typeof _this.msg.id !== 'number') {
        throw new Error('The id should be a number, but it is ' + _typeof(_this.msg.id) + ' instead');
      }
      _this.transmitToJoining = true;
    } else {
      throw new SigverError(SigverError.MESSAGE_UNKNOWN, 'Unknown message');
    }
    return _this;
  }

  createClass(IOJsonString, [{
    key: 'isToOpen',
    value: function isToOpen() {
      return this.open;
    }
  }, {
    key: 'isToJoin',
    value: function isToJoin() {
      return this.join;
    }
  }, {
    key: 'isToTransmitToOpener',
    value: function isToTransmitToOpener() {
      return this.transmitToOpener;
    }
  }, {
    key: 'isToTransmitToJoining',
    value: function isToTransmitToJoining() {
      return this.transmitToJoining;
    }
  }, {
    key: 'msgIsKeyOk',
    value: function msgIsKeyOk(isOk) {
      return '{"isKeyOk":' + isOk + '}';
    }
  }, {
    key: 'msgToJoining',
    value: function msgToJoining() {
      return '{"data":"' + this.data + '"}';
    }
  }, {
    key: 'msgToOpener',
    value: function msgToOpener(id) {
      return '{"id":' + id + ',"data":"' + this.data + '"}';
    }
  }, {
    key: 'validateKey',
    value: function validateKey() {
      if (this.key.length > KEY_LENGTH_LIMIT) {
        throw new SigverError(SigverError.KEY_TOO_LONG, 'The key length exceeds the limit of ' + KEY_LENGTH_LIMIT + ' characters');
      }
      if (typeof this._key !== 'string') {
        throw new SigverError(SigverError.KEY_FORMAT_ERROR, 'The key ' + this._key + ' is not a string');
      }
      if (this._key === '') {
        throw new SigverError(SigverError.KEY_FORMAT_ERROR, 'The key ' + this._key + ' is an empty string');
      }
    }
  }, {
    key: 'key',
    get: function get() {
      return this._key;
    }
  }, {
    key: 'id',
    get: function get() {
      return this.msg.id;
    }
  }, {
    key: 'data',
    get: function get() {
      return this.msg.data;
    }
  }]);
  return IOJsonString;
}(IO);

var Joining = function Joining(source, opener, id) {
  var _this = this;

  classCallCheck(this, Joining);

  this.source = source;
  this.source.$joining = this;
  this.opener = opener;
  this.id = id;
  this.onclose = function () {};

  this.source.on('close', function (closeEvt) {
    _this.onclose();
    _this.opener.deleteJoining(_this);
  });
};

var MAX_ID = 2147483647; // int32 max value for id generation

var Opener = function () {
  function Opener(source) {
    var _this = this;

    classCallCheck(this, Opener);

    this.source = source;
    this.source.$opener = this;
    this.joinings = new Map();
    this.onclose = function () {};

    this.source.on('close', function (closeEvt) {
      _this.onclose();
      _this.joinings.forEach(function (j) {
        j.opener = undefined;
        j.source.close(4008, 'Opener is no longer available');
      });
    });
  }

  createClass(Opener, [{
    key: 'getJoining',
    value: function getJoining(id) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.joinings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;

          console.log('Joining: ' + i[0]);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this.joinings.get(id);
    }
  }, {
    key: 'addJoining',
    value: function addJoining(source) {
      var id = this.generateId();
      this.joinings.set(id, new Joining(source, this, id));
    }
  }, {
    key: 'deleteJoining',
    value: function deleteJoining(joining) {
      this.joinings.delete(joining.id);
    }
  }, {
    key: 'generateId',
    value: function generateId() {
      var id = void 0;
      do {
        id = Math.ceil(Math.random() * MAX_ID);
        if (this.joinings.has(id)) continue;
        break;
      } while (true);
      return id;
    }
  }]);
  return Opener;
}();

var WebSocketServer = require('uws').Server;

var openers = new Map();

var Sigver = function () {
  function Sigver(options) {
    var onStart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
    classCallCheck(this, Sigver);

    this.server = new WebSocketServer(options, function () {
      console.log('Server is running on: ws://' + options.host + ':' + options.port);
      onStart();
    });

    this.server.on('error', function (err) {
      return console.error('Server error: ' + err);
    });

    this.server.on('connection', function (source) {
      source.on('message', function (data, flags) {
        try {
          var msg = new IOJsonString(data);
          if (msg.isToOpen()) {
            open(source, msg);
          } else if (msg.isToJoin()) {
            join(source, msg);
          } else if (msg.isToTransmitToOpener()) {
            transmitToOpener(source, msg);
          } else if (msg.isToTransmitToJoining()) {
            transmitToJoining(source, msg);
          }
        } catch (err) {
          if (err.name !== 'SigverError') {
            console.log('Error which not a SigverError instance: ', err);
          } else if (err.code !== SigverError.JOINING_NO_LONGER_AVAILABLE) {
            console.log(err.message);
            source.close(err.code, err.message);
          }
        }
      });
    });
  }

  createClass(Sigver, [{
    key: 'close',
    value: function close(cb) {
      console.log('Server has stopped successfully');
      this.server.close(cb);
    }
  }]);
  return Sigver;
}();

function open(source, ioMsg) {
  if (openers.has(ioMsg.key)) {
    source.send(ioMsg.msgIsKeyOk(false));
    throw new SigverError(SigverError.KEY_FOR_OPEN_EXISTS, 'The key "' + ioMsg.key + '"" exists already');
  }
  source.send(ioMsg.msgIsKeyOk(true));
  var opener = new Opener(source);
  opener.onclose = function (closeEvt) {
    return openers.delete(ioMsg.key);
  };
  openers.set(ioMsg.key, opener);
}

function join(source, ioMsg) {
  if (!openers.has(ioMsg.key)) {
    source.send(ioMsg.msgIsKeyOk(false));
    throw new SigverError(SigverError.KEY_FOR_JOIN_UNKNOWN, 'Unknown key');
  }
  source.send(ioMsg.msgIsKeyOk(true));
  openers.get(ioMsg.key).addJoining(source);
}

function transmitToJoining(source, ioMsg) {
  if (!('$opener' in source)) {
    throw new SigverError(SigverError.TRANSMIT_BEFORE_OPEN, 'Transmitting data before open');
  }
  console.log('Transmit to joining: ', ioMsg);
  var joining = source.$opener.getJoining(ioMsg.id);
  if (joining === undefined) {
    throw new SigverError(SigverError.JOINING_NO_LONGER_AVAILABLE, 'Joining is no longer available');
  }
  console.log('Sending to joining: ' + ioMsg.msgToJoining(), joining);
  joining.source.send(ioMsg.msgToJoining());
}

function transmitToOpener(source, ioMsg) {
  if (!('$joining' in source)) {
    throw new SigverError(SigverError.TRANSMIT_BEFORE_JOIN, 'Transmitting data before join');
  }
  var opener = source.$joining.opener;
  if (opener === undefined) {
    throw new SigverError(SigverError.OPENER_NO_LONGER_AVAILABLE, 'Opener is no longer available');
  }
  opener.source.send(ioMsg.msgToOpener(source.$joining.id));
}

var program = require('commander');

var host = process.env.NODE_IP || 'localhost';
var port = process.env.NODE_PORT || 8000;

program.version('7.4.2', '-v, --version').option('-h, --host <n>', 'specify host (DEFAULT: process.env.NODE_IP || "localhost")').option('-p, --port <n>', 'specify port (DEFAULT: process.env.NODE_PORT || 8000)').on('--help', function () {
  console.log('  Examples:\n\n     $ sigver\n     $ sigver -h 192.168.0.1 -p 9000\n');
}).parse(process.argv);

if (program.host) host = program.host;
if (program.port) port = program.port;

// Run server
var server = new Sigver({ host: host, port: port });

}());