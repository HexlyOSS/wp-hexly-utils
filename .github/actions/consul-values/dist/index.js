module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
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
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(888);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 21:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Query manipulation
 */



/**
 * Module dependencies.
 */

var errors = __webpack_require__(995);
var utils = __webpack_require__(293);

/**
 * Initialize a new `Query` client.
 */

function Query(consul) {
  this.consul = consul;
}

/**
 * Lists all queries
 */

Query.prototype.list = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'query.list',
    path: '/query',
  };

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Create a new query
 */

Query.prototype.create = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { service: { service: opts } };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'query.create',
    path: '/query',
    query: {},
    type: 'json',
  };

  try {
    this._params(req, opts);
    if (!req.body.Service || !req.body.Service.Service) {
      throw errors.Validation('service required');
    }
  } catch (err) {
    return callback(this.consul._err(err, req));
  }

  utils.options(req, opts, { near: true });

  this.consul._post(req, utils.body, callback);
};

/**
 * Gets a given query
 */

Query.prototype.get = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { query: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'query.get',
    path: '/query/{query}',
    params: { query: opts.query },
    query: {},
  };

  if (!opts.query) {
    return callback(this.consul._err(errors.Validation('query required'), req));
  }

  utils.options(req, opts);

  this.consul._get(req, utils.bodyItem, callback);
};

/**
 * Update existing query
 */

Query.prototype.update = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'query.update',
    path: '/query/{query}',
    params: { query: opts.query },
    query: {},
    type: 'json',
  };

  try {
    if (!opts.query) throw errors.Validation('query required');
    this._params(req, opts);
    if (!req.body.Service || !req.body.Service.Service) {
      throw errors.Validation('service required');
    }
  } catch (err) {
    return callback(this.consul._err(err, req));
  }

  utils.options(req, opts, { near: true });

  this.consul._put(req, utils.empty, callback);
};

/**
 * Destroys a given query
 */

Query.prototype.destroy = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { query: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'query.destroy',
    path: '/query/{query}',
    params: { query: opts.query },
    query: {},
  };

  if (!opts.query) {
    return callback(this.consul._err(errors.Validation('query required'), req));
  }

  utils.options(req, opts);

  this.consul._delete(req, utils.empty, callback);
};

/**
 * Executes a given query
 */

Query.prototype.execute = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { query: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'query.execute',
    path: '/query/{query}/execute',
    params: { query: opts.query },
    query: {},
  };

  if (!opts.query) {
    return callback(this.consul._err(errors.Validation('query required'), req));
  }

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Explain a given query
 */

Query.prototype.explain = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { query: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'query.explain',
    path: '/query/{query}/explain',
    params: { query: opts.query },
    query: {},
  };

  if (!opts.query) {
    return callback(this.consul._err(errors.Validation('query required'), req));
  }

  utils.options(req, opts);

  this.consul._get(req, utils.bodyItem, callback);
};

/**
 * Generate body for query create and update
 */

Query.prototype._params = function(req, opts) {
  var body = req.body || {};

  if (opts.name) body.Name = opts.name;
  if (opts.session) body.Session = opts.session;
  if (opts.token) {
    body.Token = opts.token;
    delete opts.token;
  }
  if (opts.near) body.Near = opts.near;
  if (opts.template) {
    var template = utils.normalizeKeys(opts.template);
    if (template.type || template.regexp) {
      body.Template = {};
      if (template.type) body.Template.Type = template.type;
      if (template.regexp) body.Template.Regexp = template.regexp;
    }
  }
  if (opts.service) {
    var service = utils.normalizeKeys(opts.service);
    body.Service = {};
    if (service.service) body.Service.Service = service.service;
    if (service.failover) {
      var failover = utils.normalizeKeys(service.failover);
      if (typeof failover.nearestn === 'number' || failover.datacenters) {
        body.Service.Failover = {};
        if (typeof failover.nearestn === 'number') {
          body.Service.Failover.NearestN = failover.nearestn;
        }
        if (failover.datacenters) {
          body.Service.Failover.Datacenters = failover.datacenters;
        }
      }
    }
    if (typeof service.onlypassing === 'boolean') {
      body.Service.OnlyPassing = service.onlypassing;
    }
    if (service.tags) body.Service.Tags = service.tags;
  }
  if (opts.dns) {
    var dns = utils.normalizeKeys(opts.dns);
    if (dns.ttl) body.DNS = { TTL: dns.ttl };
  }

  req.body = body;
};

/**
 * Module exports.
 */

exports.Query = Query;


/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 107:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Encoders/Decoders
 */



/**
 * Module dependencies.
 */

var querystring = __webpack_require__(191);

/**
 * Text
 */

var text = {};

text.encode = function(data) {
  return Buffer.from(data, 'utf8');
};

text.decode = function(data) {
  return Buffer.isBuffer(data) ? data.toString() : data;
};

/**
 * JSON
 */

var json = {};

json.encode = function(data) {
  return text.encode(JSON.stringify(data));
};

json.decode = function(data) {
  return JSON.parse(text.decode(data));
};

/**
 * Form
 */

var form = {};

form.encode = function(data) {
  return text.encode(querystring.stringify(data));
};

form.decode = function(data) {
  return querystring.parse(text.decode(data));
};

/**
 * Module exports.
 */

exports.json = json;
exports.form = form;
exports.text = text;


/***/ }),

/***/ 118:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const os = __webpack_require__(87);
/**
 * Commands
 *
 * Command Format:
 *   ##[name key=value;key=value]message
 *
 * Examples:
 *   ##[warning]This is the user warning message
 *   ##[set-secret name=mypassword]definitelyNotAPassword!
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        // safely append the val - avoid blowing up when attempting to
                        // call .replace() if message is not a string for some reason
                        cmdStr += `${key}=${escape(`${val || ''}`)},`;
                    }
                }
            }
        }
        cmdStr += CMD_STRING;
        // safely append the message - avoid blowing up when attempting to
        // call .replace() if message is not a string for some reason
        const message = `${this.message || ''}`;
        cmdStr += escapeData(message);
        return cmdStr;
    }
}
function escapeData(s) {
    return s.replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}
function escape(s) {
    return s
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/]/g, '%5D')
        .replace(/;/g, '%3B');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 191:
/***/ (function(module) {

module.exports = require("querystring");

/***/ }),

/***/ 198:
/***/ (function(module, __unusedexports, __webpack_require__) {

const core = __webpack_require__(369);
const Mustache = __webpack_require__(681);
const fs = __webpack_require__(747).promises;

async function parseTemplate(){
  const consulUrl = core.getInput('url', { required: true });
  const consulport = core.getInput('port', { required: true });
  const consulSecure = core.getInput('secure', { required: false });
  const consulDatacenter = core.getInput('datacenter', { required: false });
  const consulToken = core.getInput('token', { required: false }) || process.env.CONSUL_TOKEN;
  const consulKey = core.getInput('key', { required: false });
  const consulCA = core.getInput('ca', { require: false });

  const valuesExtras = core.getInput('extras', { requried: false });

  const templateFile = core.getInput('template', { required: true });
  try {
    await fs.stat(templateFile)
  } catch(e) {
    console.log(e)
    throw e;
  }

  let templateOut;
  const outFile = core.getInput('out', { required: false });
  if (outFile.length == 0){
    templateOut = `${templateFile}.parsed`;
  } else {
    templateOut = outFile;
  }

  console.log("connecting to consul");

  const consul = __webpack_require__(612)({
    host: consulUrl,
    port: consulport,
    secure: consulSecure,
    ca: [consulCA],
    defaults: {
      dc: consulDatacenter | 'dc1',
      token: consulToken
    },
    promisify: true
  });

  let values
  try {
    const parsed = valuesExtras ? JSON.parse(valuesExtras) : {};
    values = parsed
  } catch (e) {
    console.log(e);
    throw e;
  }

  try {
    console.log(`gitting key values from consul for ${consulKey}`);
    const keys = await consul.kv.get({key: consulKey, recurse: true});

    for (const key of keys) {
      if (key.Key.slice(-1) == "/") {
        continue;
      }
      const keySplit = key.Key.split('/');
      values[keySplit[keySplit.length-1]] = key.Value;
    }
  } catch(e) {
    console.log(e);
    throw e;
  }

  let parsed;

  try {
    console.log(`Parsing file ${templateFile}`);
    const data = await fs.readFile(templateFile, 'utf-8');
    const p = Mustache.render(data, values);
    parsed = p;
  } catch (e) {
    console.log(e);
    throw e;
  }

  try {
    console.log(`Writing output file ${templateOut}`);
    await fs.writeFile(templateOut, parsed);
  } catch (e) {
    console.log(e);
    throw e
  }
};

module.exports = {parseTemplate};

/***/ }),

/***/ 211:
/***/ (function(module) {

module.exports = require("https");

/***/ }),

/***/ 217:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Consul client
 */



/**
 * Module dependencies.
 */

var papi = __webpack_require__(603);
var util = __webpack_require__(669);

var Acl = __webpack_require__(840).Acl;
var Agent = __webpack_require__(607).Agent;
var Catalog = __webpack_require__(823).Catalog;
var Event = __webpack_require__(974).Event;
var Health = __webpack_require__(244).Health;
var Kv = __webpack_require__(236).Kv;
var Lock = __webpack_require__(810).Lock;
var Query = __webpack_require__(21).Query;
var Session = __webpack_require__(355).Session;
var Status = __webpack_require__(353).Status;
var Watch = __webpack_require__(784).Watch;
var utils = __webpack_require__(293);

/**
 * Initialize a new `Consul` client.
 */

function Consul(opts) {
  if (!(this instanceof Consul)) {
    return new Consul(opts);
  }

  opts = utils.defaults({}, opts);

  if (!opts.baseUrl) {
    opts.baseUrl = (opts.secure ? 'https:' : 'http:') + '//' +
      (opts.host || '127.0.0.1') + ':' +
      (opts.port || 8500) + '/v1';
  }
  opts.name = 'consul';
  opts.type = 'json';

  if (opts.defaults) {
    var defaults = utils.defaultCommonOptions(opts.defaults);
    if (defaults) this._defaults = defaults;
  }
  delete opts.defaults;

  papi.Client.call(this, opts);

  this.acl = new Consul.Acl(this);
  this.agent = new Consul.Agent(this);
  this.catalog = new Consul.Catalog(this);
  this.event = new Consul.Event(this);
  this.health = new Consul.Health(this);
  this.kv = new Consul.Kv(this);
  this.query = new Consul.Query(this);
  this.session = new Consul.Session(this);
  this.status = new Consul.Status(this);

  try {
    if (opts.promisify) {
      if (typeof opts.promisify === 'function') {
        papi.tools.promisify(this, opts.promisify);
      } else {
        papi.tools.promisify(this);
      }
    }
  } catch (err) {
    err.message = 'promisify: ' + err.message;
    throw err;
  }
}

util.inherits(Consul, papi.Client);

Consul.Acl = Acl;
Consul.Agent = Agent;
Consul.Catalog = Catalog;
Consul.Event = Event;
Consul.Health = Health;
Consul.Kv = Kv;
Consul.Lock = Lock;
Consul.Query = Query;
Consul.Session = Session;
Consul.Status = Status;
Consul.Watch = Watch;

/**
 * Object meta
 */

Consul.meta = {};

/**
 * Lock helper.
 */

Consul.meta.lock = { type: 'eventemitter' };

Consul.prototype.lock = function(opts) {
  return new Consul.Lock(this, opts);
};

/**
 * Watch helper.
 */

Consul.meta.watch = { type: 'eventemitter' };

Consul.prototype.watch = function(opts) {
  return new Consul.Watch(this, opts);
};

/**
 * Walk methods
 */

Consul.meta.walk = { type: 'sync' };

Consul.walk = Consul.prototype.walk = function() {
  return papi.tools.walk(Consul);
};

/**
 * Parse query meta
 */

Consul.meta.parseQueryMeta = { type: 'sync' };

Consul.parseQueryMeta = Consul.prototype.parseQueryMeta = function(res) {
  return utils.parseQueryMeta(res);
};

/**
 * Module exports.
 */

exports.Consul = Consul;


/***/ }),

/***/ 236:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Key/Value store
 */



/**
 * Module dependencies.
 */

var errors = __webpack_require__(995);
var utils = __webpack_require__(293);

/**
 * Initialize a new `Session` client.
 */

function Kv(consul) {
  this.consul = consul;
}

/**
 * Object meta
 */

Kv.meta = {};

/**
 * Get
 */

Kv.prototype.get = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { key: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'kv.get',
    path: '/kv/{key}',
    params: { key: (opts.key || '') },
    query: {},
  };

  if (opts.recurse) req.query.recurse = 'true';
  if (opts.raw) {
    req.query.raw = 'true';
    req.buffer = true;
  }

  utils.options(req, opts);

  this.consul._get(req, function(err, res) {
    if (res && res.statusCode === 404) return callback(undefined, undefined, res);
    if (err) return callback(err, undefined, res);
    if (opts.raw) return callback(null, res.body, res);

    if (res.body && Array.isArray(res.body) && res.body.length) {
      res.body.forEach(function(item) {
        if (!item.hasOwnProperty('Value')) return;
        item.Value = utils.decode(item.Value, opts);
      });
    } else {
      return callback(undefined, undefined, res);
    }

    if (!opts.recurse) return callback(null, res.body[0], res);

    callback(null, res.body, res);
  });
};

/**
 * Keys
 */

Kv.prototype.keys = function(opts, callback) {
  switch (typeof opts) {
    case 'string':
      opts = { key: opts };
      break;
    case 'function':
      callback = opts;
      opts = {};
      break;
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'kv.keys',
    path: '/kv/{key}',
    params: { key: (opts.key || '') },
    query: { keys: true },
  };

  if (opts.separator) req.query.separator = opts.separator;

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Set
 */

Kv.prototype.set = function(opts, callback) {
  var options;
  switch (arguments.length) {
    case 4:
      // set(key, value, opts, callback)
      options = arguments[2];
      options.key = arguments[0];
      options.value = arguments[1];
      callback = arguments[3];
      break;
    case 3:
      // set(key, value, callback)
      options = {
        key: arguments[0],
        value: arguments[1],
      };
      callback = arguments[2];
      break;
    default:
      options = opts;
  }

  options = utils.normalizeKeys(options);
  options = utils.defaults(options, this.consul._defaults);

  var req = {
    name: 'kv.set',
    path: '/kv/{key}',
    params: { key: options.key },
    query: {},
    type: 'text',
    body: options.value || '',
  };

  if (!options.key) {
    return callback(this.consul._err(errors.Validation('key required'), req));
  }
  if (!options.hasOwnProperty('value')) {
    return callback(this.consul._err(errors.Validation('value required'), req));
  }

  if (options.hasOwnProperty('cas')) req.query.cas = options.cas;
  if (options.hasOwnProperty('flags')) req.query.flags = options.flags;
  if (options.hasOwnProperty('acquire')) req.query.acquire = options.acquire;
  if (options.hasOwnProperty('release')) req.query.release = options.release;

  utils.options(req, options);

  this.consul._put(req, utils.body, callback);
};

/**
 * Delete
 */

Kv.prototype.del = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { key: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'kv.del',
    path: '/kv/{key}',
    params: { key: (opts.key || '') },
    query: {},
  };

  if (opts.recurse) req.query.recurse = 'true';

  if (opts.hasOwnProperty('cas')) req.query.cas = opts.cas;

  utils.options(req, opts);

  this.consul._delete(req, utils.body, callback);
};

Kv.meta.delete = { type: 'alias' };

Kv.prototype.delete = Kv.prototype.del;

/**
 * Module exports.
 */

exports.Kv = Kv;


/***/ }),

/***/ 244:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Health information
 */



/**
 * Module dependencies.
 */

var constants = __webpack_require__(661);
var errors = __webpack_require__(995);
var utils = __webpack_require__(293);

/**
 * Initialize a new `Health` client.
 */

function Health(consul) {
  this.consul = consul;
}

/**
 * Returns the health info of a node
 */

Health.prototype.node = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { node: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'health.node',
    path: '/health/node/{node}',
    params: { node: opts.node },
  };

  if (!opts.node) {
    return callback(this.consul._err(errors.Validation('node required'), req));
  }

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Returns the checks of a service
 */

Health.prototype.checks = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { service: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'health.checks',
    path: '/health/checks/{service}',
    params: { service: opts.service },
  };

  if (!opts.service) {
    return callback(this.consul._err(errors.Validation('service required'), req));
  }

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Returns the nodes and health info of a service
 */

Health.prototype.service = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { service: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'health.service',
    path: '/health/service/{service}',
    params: { service: opts.service },
    query: {},
  };

  if (!opts.service) {
    return callback(this.consul._err(errors.Validation('service required'), req));
  }

  if (opts.tag) req.query.tag = opts.tag;
  if (opts.passing) req.query.passing = 'true';

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Returns the checks in a given state
 */

Health.prototype.state = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { state: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'health.state',
    path: '/health/state/{state}',
    params: { state: opts.state },
  };

  if (!opts.state) {
    return callback(this.consul._err(errors.Validation('state required'), req));
  }

  if (opts.state !== 'any' && constants.CHECK_STATE.indexOf(opts.state) < 0) {
    return callback(this.consul._err(errors.Validation('state invalid: ' + opts.state), req));
  }

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Module exports.
 */

exports.Health = Health;


/***/ }),

/***/ 254:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Catalog service
 */



/**
 * Module dependencies.
 */

var errors = __webpack_require__(995);
var utils = __webpack_require__(293);

/**
 * Initialize a new `CatalogService` client.
 */

function CatalogConnect(consul) {
  this.consul = consul;
}

/**
 * Lists the nodes in a given Connect-capable service
 */

CatalogConnect.prototype.nodes = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { service: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'catalog.connect.nodes',
    path: '/catalog/connect/{service}',
    params: { service: opts.service },
    query: {},
  };

  if (!opts.service) {
    return callback(this.consul._err(errors.Validation('service required'), req));
  }

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Module Exports.
 */

exports.CatalogConnect = CatalogConnect;


/***/ }),

/***/ 293:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Helper functions
 */



/**
 * Module dependencies.
 */

var constants = __webpack_require__(661);

/**
 * Body
 */

function body(request, next) {
  if (request.err) return next(false, request.err, undefined, request.res);

  next(false, undefined, request.res.body, request.res);
}

/**
 * First item in body
 */

function bodyItem(request, next) {
  if (request.err) return next(false, request.err, undefined, request.res);

  if (request.res.body && request.res.body.length) {
    return next(false, undefined, request.res.body[0], request.res);
  }

  next(false, undefined, undefined, request.res);
}

/**
 * Empty
 */

function empty(request, next) {
  if (request.err) return next(false, request.err, undefined, request.res);

  next(false, undefined, undefined, request.res);
}

/**
 * Normalize keys
 */

function normalizeKeys(obj) {
  var result = {};

  if (obj) {
    for (var name in obj) {
      if (obj.hasOwnProperty(name)) {
        result[name.replace(/_/g, '').toLowerCase()] = obj[name];
      }
    }
  }

  return result;
}

/**
 * Defaults
 */

function defaults(obj) {
  if (!obj) obj = {};

  var src;
  for (var i = 0; i < arguments.length; i++) {
    src = arguments[i];
    for (var p in src) {
      if (src.hasOwnProperty(p) && !obj.hasOwnProperty(p)) {
        obj[p] = src[p];
      }
    }
  }

  return obj;
}

/**
 * Parse duration
 */

function parseDuration(value) {
  if (typeof value === 'number') return value / 1e6;
  if (typeof value !== 'string') return;

  var n;
  var m = value.match(/^(\d*\.?\d*)$/);

  if (m) {
    n = parseFloat(m[1]);

    if (!isNaN(n)) return n / 1e6;
  }

  m = value.match(/^([\d\.]*)(ns|us|ms|s|m|h)$/);

  if (!m) return;

  n = parseFloat(m[1]);

  if (isNaN(n)) return;

  return n * constants.DURATION_UNITS[m[2]] / 1e6;
}

/**
 * Common options
 */

function options(req, opts, ignore) {
  if (!opts) opts = {};
  if (!ignore) ignore = {};

  if (!req.headers) req.headers = {};

  // headers
  if (opts.hasOwnProperty('token') && !ignore.token) req.headers['x-consul-token'] = opts.token;

  // query
  if (!req.query) req.query = {};

  if (opts.dc && !ignore.dc) req.query.dc = opts.dc;
  if (opts.wan && !ignore.wan) req.query.wan = '1';

  if (opts.consistent && !ignore.consistent) {
    req.query.consistent = '1';
  } else if (opts.stale && !ignore.stale) {
    req.query.stale = '1';
  }

  if (opts.hasOwnProperty('index') && !ignore.index) req.query.index = opts.index;
  if (opts.hasOwnProperty('wait') && !ignore.wait) req.query.wait = opts.wait;
  if (opts.hasOwnProperty('near') && !ignore.near) req.query.near = opts.near;
  if (opts.hasOwnProperty('node-meta') && !ignore['node-meta']) {
    req.query['node-meta'] = opts['node-meta'];
  }

  // papi
  if (opts.hasOwnProperty('ctx') && !ignore.ctx) req.ctx = opts.ctx;
  if (opts.hasOwnProperty('timeout') && !ignore.timeout) {
    if (typeof opts.timeout === 'string') {
      req.timeout = parseDuration(opts.timeout);
    } else {
      req.timeout = opts.timeout;
    }
  }
}

/**
 * Default common options
 */

function defaultCommonOptions(opts) {
  opts = normalizeKeys(opts);
  var defaults;

  constants.DEFAULT_OPTIONS.forEach(function(key) {
    if (!opts.hasOwnProperty(key)) return;
    if (!defaults) defaults = {};
    defaults[key] = opts[key];
  });

  return defaults;
}

/**
 * Decode value
 */

function decode(value, opts) {
  if (typeof value !== 'string') return value;
  value = Buffer.from(value, 'base64');
  if (!opts || !opts.buffer) value = value.toString();
  return value;
}

/**
 * Shallow clone
 */

function clone(src) {
  var dst = {};

  for (var key in src) {
    if (src.hasOwnProperty(key)) {
      dst[key] = src[key];
    }
  }

  return dst;
}

/**
 * Set timeout with cancel support
 */

function setTimeoutContext(fn, ctx, timeout) {
  var id;

  var cancel = function() {
    clearTimeout(id);
  };

  id = setTimeout(function() {
    ctx.removeListener('cancel', cancel);

    fn();
  }, timeout);

  ctx.once('cancel', cancel);
}

/**
 * Set interval with cancel support
 */

function setIntervalContext(fn, ctx, timeout) {
  var id;

  var cancel = function() {
    clearInterval(id);
  };

  id = setInterval(function() { fn(); }, timeout);

  ctx.once('cancel', cancel);
}

/**
 * Create node/server-level check object
 * Corresponds to CheckType in Consul Agent Endpoint:
 * https://github.com/hashicorp/consul/blob/master/command/agent/check.go#L43
 * Corresponds to AgentServiceCheck in Consul Go API (which currently omits Notes):
 * https://github.com/hashicorp/consul/blob/master/api/agent.go#L66
 * Currently omits ID and Name fields:
 * https://github.com/hashicorp/consul/issues/2223
 */

function _createServiceCheck(src) {
  var dst = {};

  if ((src.grpc || src.http || src.tcp || src.args || src.script) && src.interval) {
    if (src.grpc) {
      dst.GRPC = src.grpc;
      if (src.hasOwnProperty('grpcusetls')) dst.GRPCUseTLS = src.grpcusetls;
    } else if (src.http) {
      dst.HTTP = src.http;
      if (src.hasOwnProperty('tlsskipverify')) dst.TLSSkipVerify = src.tlsskipverify;
    } else if (src.tcp){
      dst.TCP = src.tcp;
    } else {
      if (src.args) {
        dst.Args = src.args;
      } else {
        dst.Script = src.script;
      }
      if (src.hasOwnProperty('dockercontainerid')) dst.DockerContainerID = src.dockercontainerid;
      if (src.hasOwnProperty('shell')) dst.Shell = src.shell;
    }
    dst.Interval = src.interval;
    if (src.hasOwnProperty('timeout')) dst.Timeout = src.timeout;
  } else if (src.ttl) {
    dst.TTL = src.ttl;
  } else if (src.aliasnode || src.aliasservice) {
    if (src.hasOwnProperty('aliasnode')) dst.AliasNode = src.aliasnode;
    if (src.hasOwnProperty('aliasservice')) dst.AliasService = src.aliasservice;
  } else {
    throw new Error('args/grpc/http/tcp and interval, ttl, or aliasnode/aliasservice');
  }
  if (src.hasOwnProperty('notes')) dst.Notes = src.notes;
  if (src.hasOwnProperty('status')) dst.Status = src.status;
  if (src.hasOwnProperty('deregistercriticalserviceafter')) {
    dst.DeregisterCriticalServiceAfter = src.deregistercriticalserviceafter;
  }

  return dst;
}

function createServiceCheck(src) {
  return _createServiceCheck(normalizeKeys(src));
}

/**
 * Create standalone check object
 * Corresponds to CheckDefinition in Consul Agent Endpoint:
 * https://github.com/hashicorp/consul/blob/master/command/agent/structs.go#L47
 * Corresponds to AgentCheckRegistration in Consul Go API:
 * https://github.com/hashicorp/consul/blob/master/api/agent.go#L57
 */

function createCheck(src) {
  src = normalizeKeys(src);

  var dst = _createServiceCheck(src);

  if (src.name) {
    dst.Name = src.name;
  } else {
    throw new Error('name required');
  }

  if (src.hasOwnProperty('id')) dst.ID = src.id;
  if (src.hasOwnProperty('serviceid')) dst.ServiceID = src.serviceid;

  return dst;
}

/**
 * Has the Consul index changed.
 */

function hasIndexChanged(index, prevIndex) {
  if (typeof index !== 'string' || !index) return false;
  if (typeof prevIndex !== 'string' || !prevIndex) return true;
  return index !== prevIndex;
}

/**
 * Parse query meta
 */

function parseQueryMeta(res) {
  var meta = {};

  if (res && res.headers) {
    if (res.headers['x-consul-index']) {
      meta.LastIndex = res.headers['x-consul-index'];
    }
    if (res.headers['x-consul-lastcontact']) {
      meta.LastContact = parseInt(res.headers['x-consul-lastcontact'], 10);
    }
    if (res.headers['x-consul-knownleader']) {
      meta.KnownLeader = res.headers['x-consul-knownleader'] === 'true';
    }
    if (res.headers['x-consul-translate-addresses']) {
      meta.AddressTranslationEnabled = res.headers['x-consul-translate-addresses'] === 'true';
    }
  }

  return meta;
}

/**
 * Module exports
 */

exports.body = body;
exports.bodyItem = bodyItem;
exports.decode = decode;
exports.empty = empty;
exports.normalizeKeys = normalizeKeys;
exports.defaults = defaults;
exports.options = options;
exports.defaultCommonOptions = defaultCommonOptions;
exports.clone = clone;
exports.parseDuration = parseDuration;
exports.setTimeoutContext = setTimeoutContext;
exports.setIntervalContext = setIntervalContext;
exports.createServiceCheck = createServiceCheck;
exports.createCheck = createCheck;
exports.hasIndexChanged = hasIndexChanged;
exports.parseQueryMeta = parseQueryMeta;


/***/ }),

/***/ 326:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Agent service
 */



/**
 * Module dependencies.
 */

var errors = __webpack_require__(995);
var utils = __webpack_require__(293);

/**
 * Initialize a new `AgentService` client.
 */

function AgentService(consul) {
  this.consul = consul;
}

/**
 * Returns the services local agent is managing
 */

AgentService.prototype.list = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'agent.service.list',
    path: '/agent/services',
  };

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Registers a new local service
 */

AgentService.prototype.register = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { name: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'agent.service.register',
    path: '/agent/service/register',
    type: 'json',
    body: {},
  };

  if (!opts.name) {
    return callback(this.consul._err(errors.Validation('name required'), req));
  }

  req.body.Name = opts.name;
  if (opts.id) req.body.ID = opts.id;
  if (opts.tags) req.body.Tags = opts.tags;
  if (opts.meta) req.body.Meta =  opts.meta;
  if (opts.hasOwnProperty('address')) req.body.Address = opts.address;
  if (opts.hasOwnProperty('port')) req.body.Port = opts.port;

  try {
    if (Array.isArray(opts.checks)) {
      req.body.Checks = opts.checks.map(utils.createServiceCheck);
    } else if (opts.check) {
      req.body.Check = utils.createServiceCheck(opts.check);
    }
  } catch (err) {
    return callback(this.consul._err(errors.Validation(err.message), req));
  }

  utils.options(req, opts);

  this.consul._put(req, utils.empty, callback);
};

/**
 * Deregister a local service
 */

AgentService.prototype.deregister = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'agent.service.deregister',
    path: '/agent/service/deregister/{id}',
    params: { id: opts.id },
  };

  if (!opts.id) {
    return callback(this.consul._err(errors.Validation('id required'), req));
  }

  utils.options(req, opts);

  this.consul._put(req, utils.empty, callback);
};

/**
 * Manages node maintenance mode
 */

AgentService.prototype.maintenance = function(opts, callback) {
  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'agent.service.maintenance',
    path: '/agent/service/maintenance/{id}',
    params: { id: opts.id },
    query: { enable: opts.enable },
  };

  if (!opts.id) {
    return callback(this.consul._err(errors.Validation('id required'), req));
  }
  if (typeof opts.enable !== 'boolean') {
    return callback(this.consul._err(errors.Validation('enable required'), req));
  }
  if (opts.reason) req.query.reason = opts.reason;

  utils.options(req, opts);

  this.consul._put(req, utils.empty, callback);
};

/**
 * Module Exports.
 */

exports.AgentService = AgentService;


/***/ }),

/***/ 333:
/***/ (function(__unusedmodule, exports) {

"use strict";
/**
 * Random useful tools.
 */



/**
 * Walk "standard" library
 */

function walk(obj, name, tree) {
  switch (arguments.length) {
    case 1:
      name = obj.name;
      tree = { name: name };
      break;
    case 2:
      tree = { name: name };
      break;
    case 3:
      break;
    default:
      throw new Error('invalid arguments');
  }

  Object.keys(obj.prototype).forEach(function(key) {
    var v = obj.prototype[key];

    if (!key.match(/^[a-z]+/)) return;
    if (!tree.methods) tree.methods = {};

    tree.methods[key] = {
      name: key,
      value: v,
    };

    var meta = obj.meta || {};

    tree.methods[key].type = meta[key] && meta[key].type || 'callback';
  });

  Object.keys(obj).forEach(function(key) {
    var v = obj[key];

    if (!key.match(/^[A-Z]+/)) return;
    if (!tree.objects) tree.objects = {};

    tree.objects[key] = {
      name: key,
      value: v,
    };

    walk(v, key, tree.objects[key]);
  });

  return tree;
}

/**
 * Callback wrapper
 */

function fromCallback(fn) {
  return new Promise(function(resolve, reject) {
    try {
      return fn(function(err, data) {
        if (err) return reject(err);
        return resolve(data);
      });
    } catch (err) {
      return reject(err);
    }
  });
}

/**
 * Wrap callbacks with promises
 */

function promisify(client, wrapper) {
  if (!client) throw new Error('client required');
  if (!wrapper) {
    if (global.Promise) {
      wrapper = fromCallback;
    } else {
      throw new Error('wrapper required');
    }
  } else if (typeof wrapper !== 'function') {
    throw new Error('wrapper must be a function');
  }

  var patch = function(client, tree) {
    Object.keys(tree.methods).forEach(function(key) {
      var method = tree.methods[key];
      var fn = client[method.name];

      if (method.type === 'callback' && !client[method.name]._wrapCallback) {
        client[method.name] = function() {
          // use callback if provided
          if (typeof arguments[arguments.length - 1] === 'function') {
            return fn.apply(client, arguments);
          }

          // otherwise return promise
          var args = Array.prototype.slice.call(arguments);
          return wrapper(function(callback) {
            args.push(callback);
            return fn.apply(client, args);
          });
        };
        client[method.name]._wrapped = true;
      }
    });

    if (tree.objects) {
      Object.keys(tree.objects).forEach(function(key) {
        var clientKey = key[0].toLowerCase() + key.slice(1);
        patch(client[clientKey], tree.objects[key]);
      });
    }
  };

  patch(client, walk(client.constructor));
}

/**
 * Module exports.
 */

exports.promisify = promisify;
exports.walk = walk;


/***/ }),

/***/ 353:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Status information
 */



/**
 * Module dependencies.
 */

var utils = __webpack_require__(293);

/**
 * Initialize a new `Status` client.
 */

function Status(consul) {
  this.consul = consul;
}

/**
 * Returns the current Raft leader.
 */

Status.prototype.leader = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'status.leader',
    path: '/status/leader',
  };

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Returns the current Raft peer set
 */

Status.prototype.peers = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'status.peers',
    path: '/status/peers',
  };

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Module exports.
 */

exports.Status = Status;


/***/ }),

/***/ 355:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Session manipulation
 */



/**
 * Module dependencies.
 */

var errors = __webpack_require__(995);
var utils = __webpack_require__(293);

/**
 * Initialize a new `Session` client.
 */

function Session(consul) {
  this.consul = consul;
}

/**
 * Creates a new session
 */

Session.prototype.create = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'session.create',
    path: '/session/create',
    query: {},
    type: 'json',
    body: {},
  };

  if (opts.lockdelay) req.body.LockDelay = opts.lockdelay;
  if (opts.name) req.body.Name = opts.name;
  if (opts.node) req.body.Node = opts.node;
  if (opts.checks) req.body.Checks = opts.checks;
  if (opts.behavior) req.body.Behavior = opts.behavior;
  if (opts.ttl) req.body.TTL = opts.ttl;

  utils.options(req, opts);

  this.consul._put(req, utils.body, callback);
};

/**
 * Destroys a given session
 */

Session.prototype.destroy = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'session.destroy',
    path: '/session/destroy/{id}',
    params: { id: opts.id },
    query: {},
  };

  if (!opts.id) {
    return callback(this.consul._err(errors.Validation('id required'), req));
  }

  utils.options(req, opts);

  this.consul._put(req, utils.empty, callback);
};

/**
 * Queries a given session
 */

Session.prototype.info = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'session.info',
    path: '/session/info/{id}',
    params: { id: opts.id },
    query: {},
  };

  if (!opts.id) {
    return callback(this.consul._err(errors.Validation('id required'), req));
  }

  utils.options(req, opts);

  this.consul._get(req, utils.bodyItem, callback);
};

Session.prototype.get = Session.prototype.info;

/**
 * Lists sessions belonging to a node
 */

Session.prototype.node = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { node: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'session.node',
    path: '/session/node/{node}',
    params: { node: opts.node },
  };

  if (!opts.node) {
    return callback(this.consul._err(errors.Validation('node required'), req));
  }

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Lists all the active sessions
 */

Session.prototype.list = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'session.list',
    path: '/session/list',
  };

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Renews a TTL-based session
 */

Session.prototype.renew = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'session.renew',
    path: '/session/renew/{id}',
    params: { id: opts.id },
  };

  if (!opts.id) {
    return callback(this.consul._err(errors.Validation('id required'), req));
  }

  utils.options(req, opts);

  this.consul._put(req, utils.body, callback);
};

/**
 * Module exports.
 */

exports.Session = Session;


/***/ }),

/***/ 369:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(118);
const os = __webpack_require__(87);
const path = __webpack_require__(622);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable
 */
function exportVariable(name, val) {
    process.env[name] = val;
    command_1.issueCommand('set-env', { name }, val);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store
 */
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message
 */
function error(message) {
    command_1.issue('error', message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message
 */
function warning(message) {
    command_1.issue('warning', message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store
 */
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 448:
/***/ (function(__unusedmodule, exports) {

"use strict";
/**
 * Helper functions
 */



/**
 * Check if object is empty
 */

function isEmpty(obj) {
  if (!obj) return true;

  for (var p in obj) {
    if (obj.hasOwnProperty(p)) return false;
  }

  return true;
}

/**
 * Check stream
 */

function isStream(s) {
  return s !== null &&
    typeof s === 'object' &&
    typeof s.pipe === 'function';
}

/**
 * Check readable stream
 */

function isReadableStream(s) {
  return isStream(s) && s.readable !== false;
}

/**
 * Check writiable stream
 */

function isWritableStream(s) {
  return isStream(s) && s.writable !== false;
}

/**
 * Merge in objects
 */

function merge() {
  var data = {};

  if (!arguments.length) return data;

  var args = Array.prototype.slice.call(arguments, 0);

  args.forEach(function(obj) {
    if (!obj) return;

    Object.keys(obj).forEach(function(key) {
      data[key] = obj[key];
    });
  });

  return data;
}

/**
 * Merge headers
 */

function mergeHeaders() {
  var data = {};

  if (!arguments.length) return data;

  var args = Array.prototype.slice.call(arguments, 0);

  args.forEach(function(obj) {
    if (!obj) return;

    Object.keys(obj).forEach(function(key) {
      data[key.toLowerCase()] = obj[key];
    });
  });

  return data;
}

/**
 * Create a shallow copy of obj composed of the specified properties.
 */

function pick(obj) {
  var args = Array.prototype.slice.call(arguments);
  args.shift();

  if (args.length === 1 && Array.isArray(args[0])) {
    args = args[0];
  }

  var result = {};

  args.forEach(function(name) {
    if (obj.hasOwnProperty(name)) {
      result[name] = obj[name];
    }
  });

  return result;
}

/**
 * Module exports.
 */

exports.isEmpty = isEmpty;
exports.isReadableStream = isReadableStream;
exports.isWritableStream = isWritableStream;
exports.merge = merge;
exports.mergeHeaders = mergeHeaders;
exports.pick = pick;


/***/ }),

/***/ 603:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


/**
 * Module dependencies.
 */

var Client = __webpack_require__(623).Client;
var codecs = __webpack_require__(107);
var shortcuts = __webpack_require__(609);
var tools = __webpack_require__(333);

/**
 * Module exports.
 */

exports.Client = Client;

exports.request = shortcuts.request;
exports.get = shortcuts.method('GET');
exports.head = shortcuts.method('HEAD');
exports.post = shortcuts.method('POST');
exports.put = shortcuts.method('PUT');
exports.del = exports['delete'] = shortcuts.method('DELETE');
exports.patch = shortcuts.method('PATCH');

exports.codecs = codecs;
exports.tools = tools;


/***/ }),

/***/ 605:
/***/ (function(module) {

module.exports = require("http");

/***/ }),

/***/ 607:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Agent control
 */



/**
 * Module dependencies.
 */

var AgentCheck = __webpack_require__(660).AgentCheck;
var AgentService = __webpack_require__(326).AgentService;
var errors = __webpack_require__(995);
var utils = __webpack_require__(293);

/**
 * Initialize a new `Agent` client.
 */

function Agent(consul) {
  this.consul = consul;
  this.check = new Agent.Check(consul);
  this.service = new Agent.Service(consul);
}

Agent.Check = AgentCheck;
Agent.Service = AgentService;

/**
 * Returns the checks the local agent is managing
 */

Agent.prototype.checks = function() {
  this.check.list.apply(this.check, arguments);
};

/**
 * Returns the services local agent is managing
 */

Agent.prototype.services = function() {
  this.service.list.apply(this.service, arguments);
};

/**
 * Returns the members as seen by the local consul agent
 */

Agent.prototype.members = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'agent.members',
    path: '/agent/members',
    query: {},
  };

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Reload agent configuration
 */

Agent.prototype.reload = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'agent.reload',
    path: '/agent/reload',
  };

  utils.options(req, opts);

  this.consul._put(req, utils.empty, callback);
};

/**
 * Returns the local node configuration
 */

Agent.prototype.self = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'agent.self',
    path: '/agent/self',
  };

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Manages node maintenance mode
 */

Agent.prototype.maintenance = function(opts, callback) {
  if (typeof opts === 'boolean') {
    opts = { enable: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'agent.maintenance',
    path: '/agent/maintenance',
    query: { enable: opts.enable },
  };

  if (typeof opts.enable !== 'boolean') {
    return callback(this.consul._err(errors.Validation('enable required'), req));
  }
  if (opts.reason) req.query.reason = opts.reason;

  utils.options(req, opts);

  this.consul._put(req, utils.empty, callback);
};

/**
 * Trigger local agent to join a node
 */

Agent.prototype.join = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { address: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'agent.join',
    path: '/agent/join/{address}',
    params: { address: opts.address },
  };

  if (!opts.address) {
    return callback(this.consul._err(errors.Validation('address required'), req));
  }

  utils.options(req, opts);

  this.consul._put(req, utils.empty, callback);
};

/**
 * Force remove node
 */

Agent.prototype.forceLeave = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { node: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'agent.forceLeave',
    path: '/agent/force-leave/{node}',
    params: { node: opts.node },
  };

  if (!opts.node) {
    return callback(this.consul._err(errors.Validation('node required'), req));
  }

  utils.options(req, opts);

  this.consul._put(req, utils.empty, callback);
};

/**
 * Module exports.
 */

exports.Agent = Agent;


/***/ }),

/***/ 609:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


/**
 * Module dependencies.
 */

var url = __webpack_require__(835);

var Client = __webpack_require__(623).Client;
var errors = __webpack_require__(948);

/**
 * Request.
 */

function request(opts) {
  if (typeof opts === 'string') {
    arguments[0] = opts = { method: 'get', url: opts };
  } else {
    opts = opts || {};
  }

  try {
    if (!opts.url) {
      throw errors.Validation('url required');
    }

    if (typeof opts.url !== 'string') {
      throw errors.Validation('url must be a string');
    }

    var baseUrl = url.parse(opts.url);

    opts.path = baseUrl.pathname.replace('%7B', '{').replace('%7D', '}');
    baseUrl.pathname = '';

    var client = new Client({ baseUrl: baseUrl });

    delete opts.url;

    client._request.apply(client, arguments);
  } catch (err) {
    var callback = arguments[arguments.length - 1];

    if (typeof callback !== 'function') {
      err.message = 'no callback: ' + err.message;
      throw err;
    }

    callback(err);
  }
}

/**
 * Method.
 */

function method(name) {
  return function(opts) {
    if (typeof opts === 'string') {
      arguments[0] = opts = { url: opts };
    } else {
      opts = opts || {};
    }

    opts.method = name;

    request.apply(null, arguments);
  };
}

/**
 * Module exports.
 */

exports.method = method;
exports.request = request;


/***/ }),

/***/ 612:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";
/**
 * Module index
 */



/**
 * Module dependencies.
 */

var Consul = __webpack_require__(217).Consul;

/**
 * Module exports.
 */

module.exports = Consul;


/***/ }),

/***/ 614:
/***/ (function(module) {

module.exports = require("events");

/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 623:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * HTTP client.
 */



/**
 * Module dependencies.
 */

var events = __webpack_require__(614);
var http = __webpack_require__(605);
var https = __webpack_require__(211);
var url = __webpack_require__(835);
var util = __webpack_require__(669);

var constants = __webpack_require__(998);
var errors = __webpack_require__(948);
var meta = __webpack_require__(884);
var utils = __webpack_require__(448);

/**
 * Client
 */

function Client(opts) {
  if (!(this instanceof Client)) {
    return new Client(opts);
  }

  events.EventEmitter.call(this);

  opts = opts || {};

  if (typeof opts === 'string') {
    opts = { baseUrl: opts };
  } else {
    opts = utils.merge(opts);
  }

  if (!opts.baseUrl) {
    throw errors.Validation('baseUrl required');
  }

  if (!(opts.baseUrl instanceof url.Url)) {
    if (typeof opts.baseUrl !== 'string') {
      throw errors.Validation('baseUrl must be a string: ' + opts.baseUrl);
    }

    opts.baseUrl = url.parse(opts.baseUrl);
  }

  var path = opts.baseUrl.pathname;
  opts.baseUrl = utils.pick(opts.baseUrl,
    'auth', 'hostname', 'port', 'protocol');
  opts.baseUrl.path = path;

  if (opts.baseUrl.path === '/') {
    opts.baseUrl.path = '';
  } else if (opts.baseUrl.path[opts.baseUrl.path.length - 1] === '/') {
    throw errors.Validation('baseUrl must not end with a forward slash');
  }

  opts.headers = utils.mergeHeaders(opts.headers);
  if (opts.tags) {
    if (Array.isArray(opts.tags)) {
      opts.tags = opts.tags.slice(0);
    } else {
      throw errors.Validation('tags must be an array');
    }
  } else {
    opts.tags = [];
  }

  if (opts.name && !~opts.tags.indexOf(opts.name)) {
    opts.tags.push(opts.name);
  }

  opts.encoders = utils.merge(constants.ENCODERS, opts.encoders);
  opts.decoders = utils.merge(constants.DECODERS, opts.decoders);

  this._opts = opts;
  this._exts = {};
}

util.inherits(Client, events.EventEmitter);

/**
 * Add information to error
 */

Client.prototype._err = function(err, opts) {
  if (!err) return err;

  if (!(err instanceof Error)) err = new Error(err);

  if (opts && opts.name) {
    err.message = util.format('%s: %s', opts.name, err.message);
  }

  if (this._opts.name) {
    err.message = util.format('%s: %s', this._opts.name, err.message);
  }

  return err;
};

/**
 * Register an extension
 */

Client.prototype._ext = function(eventName, callback) {
  if (!eventName || typeof eventName !== 'string') {
    throw this._err(errors.Validation('extension eventName required'));
  }

  if (typeof callback !== 'function') {
    throw this._err(errors.Validation('extension callback required'));
  }

  if (!this._exts[eventName]) this._exts[eventName] = [];

  this._exts[eventName].push(callback);
};

/**
 * Register a plugin
 */

Client.prototype._plugin = function(plugin, options) {
  if (!plugin) {
    throw this._err(errors.Validation('plugin required'));
  }

  if (typeof plugin.register !== 'function') {
    throw this._err(errors.Validation('plugin must have register function'));
  }

  var attributes = plugin.register.attributes;

  if (!attributes) {
    throw this._err(errors.Validation('plugin attributes required'));
  }

  if (!attributes.name) {
    throw this._err(errors.Validation('plugin attributes name required'));
  }

  if (!attributes.version) {
    throw this._err(errors.Validation('plugin attributes version required'));
  }

  return plugin.register(this, options || {});
};

/**
 * Log request events
 */

Client.prototype._log = function(tags, data) {
  return this.emit('log', tags, data);
};

/**
 * Encode
 */

Client.prototype._encode = function(mime, value) {
  if (!this._opts.encoders[mime]) {
    throw errors.Codec('unknown encoder: ' + mime);
  }

  try {
    return this._opts.encoders[mime](value);
  } catch (err) {
    err.message = 'encode (' + mime + ') failed: ' + err.message;
    throw errors.Codec(err);
  }
};

/**
 * Decode
 */

Client.prototype._decode = function(mime, value) {
  if (!this._opts.decoders[mime]) {
    throw errors.Codec('unknown decoder: ' + mime);
  }

  try {
    return this._opts.decoders[mime](value);
  } catch (err) {
    err.message = 'decode (' + mime + ') failed: ' + err.message;
    throw errors.Codec(err);
  }
};

/**
 * Push ext list
 */

Client.prototype.__push = function(request, name) {
  if (this._exts[name]) {
    request._stack.push.apply(request._stack, this._exts[name]);
  }

  if (request.opts && request.opts.exts && request.opts.exts[name]) {
    if (Array.isArray(request.opts.exts[name])) {
      request._stack.push.apply(request._stack, request.opts.exts[name]);
    } else {
      request._stack.push(request.opts.exts[name]);
    }
  }
};

/**
 * Run request pipeline
 */

Client.prototype._request = function(opts) {
  var self = this;

  var request;

  if (this.__request) {
    request = this.__request;
    opts = request.opts;
    self = request._client;
  } else {
    request = {
      _args: Array.prototype.slice.call(arguments),
      _client: this,
      opts: opts,
      state: {},
    };

    if (!opts) opts = request.opts = {};

    if (request._args.length > 1) {
      request._callback = request._args[request._args.length - 1];
    } else {
      return self.emit('error', self._err(
        errors.Validation('callback required'), opts));
    }

    // if ctx is an event emitter we use it to abort requests when done is
    // emitted
    if (opts.ctx instanceof events.EventEmitter) {
      request.ctx = opts.ctx;
    }

    // combine global and request tags
    opts.tags = (opts.tags || []).concat(self._opts.tags);

    // inject request name into tags if not already defined
    if (opts.name && !~opts.tags.indexOf(opts.name)) {
      opts.tags.push(opts.name);
    }

    if (!opts.headers) opts.headers = {};
    if (!opts.params) opts.params = {};
    if (!opts.query) opts.query = {};

    // restart request
    request.retry = function() {
      if (request._retryable === false) {
        throw errors.Validation('request is not retryable');
      }

      self._log(['papi', 'request', 'retry'].concat(request.opts.tags));

      delete request.body;
      delete request.err;
      delete request.req;
      delete request.res;
      delete request.transport;

      self._request.call({ __request: request });
    };

    request._stack = [];

    self.__push(request, 'onCreate');

    request._stack.push(self.__create);

    self.__push(request, 'onRequest');

    request._stack.push(self.__execute);

    self.__push(request, 'onResponse');

    request._stack.push.apply(
      request._stack,
      request._args.slice(1, request._args.length - 1)
    );
  }

  var i = 0;
  function next(err) {
    if (err) return request._callback(self._err(err, opts));

    // middlware can call next(false, args...) to stop middleware
    if (err === false) {
      return request._callback.apply(null,
        Array.prototype.slice.call(arguments, 1));
    }

    var fn = request._stack[i++];
    if (fn) {
      fn.call(self, request, next);
    } else {
      request._callback.call(self, self._err(request.err, opts), request.res);
    }
  }

  next();
};

/**
 * Create HTTP request
 */

Client.prototype.__create = function(request, next) {
  var self = this;

  var opts = request.opts;
  var path = opts.path;

  if (typeof path !== 'string') {
    return next(errors.Validation('path required'));
  }

  var headers = utils.mergeHeaders(self._opts.headers, opts.headers);

  // path
  try {
    path = path.replace(/\{(\w+)\}/g, function(src, dst) {
      if (!opts.params.hasOwnProperty(dst)) {
        throw errors.Validation('missing param: ' + dst);
      }

      var part = opts.params[dst] || '';

      // optionally disable param encoding
      return part.encode === false && part.toString ?
        part.toString() : encodeURIComponent(part);
    });
  } catch (err) {
    return next(err);
  }

  // query
  if (!utils.isEmpty(opts.query)) {
    try {
      path += '?' + self._encode('application/x-www-form-urlencoded',
                                 opts.query).toString();
    } catch (err) {
      return next(err);
    }
  }

  // body
  if (opts.body !== undefined) {
    var mime = constants.MIME_ALIAS[opts.type] ||
      headers['content-type'] ||
      constants.MIME_ALIAS[self._opts.type];

    var isFunction = typeof opts.body === 'function';

    if (isFunction) {
      try {
        request.body = opts.body();
      } catch (err) {
        return next(err);
      }
    } else {
      request.body = opts.body;
    }

    var isBuffer = Buffer.isBuffer(request.body);
    var isStream = utils.isReadableStream(request.body);

    if (!isBuffer && !isStream && !mime) {
      return next(errors.Validation('type required'));
    }

    if (!isBuffer && !isStream) {
      if (self._opts.encoders[mime]) {
        try {
          request.body = this._encode(mime, request.body);
        } catch (err) {
          return next(err);
        }
      } else {
        return next(errors.Codec('type is unknown: ' + mime));
      }
    }

    if (!headers['content-type'] && mime) {
      headers['content-type'] = mime + '; charset=' + constants.CHARSET;
    }

    if (isStream) {
      if (!isFunction) request._retryable = false;
    } else {
      headers['content-length'] = request.body.length;
    }
  } else if (!~constants.EXCLUDE_CONTENT_LENGTH.indexOf(opts.method)) {
    headers['content-length'] = 0;
  }

  // response pipe
  if (opts.pipe) {
    var isPipeFunction = typeof opts.pipe === 'function';

    if (isPipeFunction) {
      try {
        request.pipe = opts.pipe();
      } catch (err) {
        return next(err);
      }
    } else {
      request.pipe = opts.pipe;

      request._retryable = false;
    }

    if (!utils.isWritableStream(request.pipe)) {
      return next(errors.Validation('pipe must be a writable stream'));
    }
  }

  // build http.request options
  request.req = utils.merge(
    utils.pick(self._opts, constants.CLIENT_OPTIONS),
    utils.pick(self._opts.baseUrl, 'auth', 'hostname', 'port', 'path'),
    utils.pick(opts, constants.REQUEST_OPTIONS),
    { headers: headers }
  );

  // append request path to baseUrl
  request.req.path += path;

  // pick http transport
  if (self._opts.baseUrl.protocol === 'https:') {
    request.transport = https;
    if (!request.req.port) request.req.port = 443;
  } else {
    request.transport = http;
    if (!request.req.port) request.req.port = 80;
  }

  if (request.req.auth === null) delete request.req.auth;

  next();
};

/**
 * Execute HTTP request
 */

Client.prototype.__execute = function(request, next) {
  var self = this;

  if (request.ctx) {
    if (request.ctx.canceled === true) {
      return next(errors.Validation('ctx already canceled'));
    } else if (request.ctx.finished === true) {
      return next(errors.Validation('ctx already finished'));
    }
  }

  var done = false;

  var opts = request.opts;

  var abort;
  var timeoutId;
  var timeout = opts.hasOwnProperty('timeout') ?
    opts.timeout : self._opts.timeout;

  self._log(['papi', 'request'].concat(opts.tags), request.req);

  var req = request.transport.request(request.req);

  var userAgent = req.getHeader('user-agent');

  if (userAgent === undefined) {
    req.setHeader('user-agent', 'papi/' + meta.version);
  } else if (userAgent === null) {
    req.removeHeader('user-agent');
  }

  req.on('error', function(err) {
    self._log(['papi', 'request', 'error'].concat(opts.tags), err);

    if (done) return;
    done = true;

    if (abort) request.ctx.removeListener('cancel', abort);
    if (timeoutId) clearTimeout(timeoutId);

    request.err = err;
    next();
  });

  if (request.ctx) {
    abort = function() {
      req.abort();
      req.emit('error', errors.Abort('request aborted'));
    };

    request.ctx.once('cancel', abort);
  }

  // set request and absolute timeout
  if (timeout && timeout > 0) {
    timeoutId = setTimeout(function() {
      req.emit('timeout');
      req.abort();
    }, timeout);

    req.setTimeout(timeout);
  }

  req.on('timeout', function(err) {
    self._log(['papi', 'request', 'error', 'timeout'].concat(opts.tags));
    if (err) {
      err = errors.Timeout(err);
    } else {
      err = errors.Timeout('request timed out (' + timeout + 'ms)');
    }
    req.emit('error', err);
  });

  req.on('response', function(res) {
    var chunks = [];
    var bodyLength = 0;

    self._log(['papi', 'response'].concat(opts.tags), {
      method: opts.method,
      path: req.path,
      statusCode: res.statusCode,
      headers: res.headers,
      remoteAddress: res.connection && res.connection.remoteAddress,
      remotePort: res.connection && res.connection.remotePort,
    });

    request.res = res;

    if (request.pipe) {
      res.pipe(request.pipe);
    } else {
      res.on('data', function(chunk) {
        chunks.push(chunk);
        bodyLength += chunk.length;
      });
    }

    res.on('end', function() {
      if (done) return;
      done = true;

      if (abort) request.ctx.removeListener('cancel', abort);
      if (timeoutId) clearTimeout(timeoutId);

      // body content mime
      var mime;

      // decode body
      if (bodyLength) {
        res.body = Buffer.concat(chunks, bodyLength);

        // don't decode if user explicitly asks for buffer
        if (!opts.buffer) {
          mime = (res.headers['content-type'] || '').split(';')[0].trim();

          if (self._opts.decoders[mime]) {
            try {
              res.body = self._decode(mime, res.body);
            } catch (err) {
              request.err = err;
              return next();
            }
          }
        }
      }

      // any non-200 is consider an error
      if (Math.floor(res.statusCode / 100) !== 2) {
        var err = errors.Response();

        if (res.body && mime === 'text/plain' && res.body.length < 80) {
          err.message = res.body;
        }

        if (!err.message) {
          if (http.STATUS_CODES[res.statusCode]) {
            err.message = http.STATUS_CODES[res.statusCode].toLowerCase();
          } else {
            err.message = 'request failed: ' + res.statusCode;
          }
        }

        err.statusCode = res.statusCode;

        request.err = err;
      }

      next();
    });
  });

  if (utils.isReadableStream(request.body)) {
    request.body.pipe(req);
  } else {
    req.end(request.body);
  }
};

/**
 * Shortcuts
 */

constants.METHODS.forEach(function(method) {
  var reqMethod = method.toUpperCase();

  Client.prototype['_' + method] = function(opts) {
    var args;

    if (typeof opts === 'string') {
      opts = { path: opts, method: reqMethod };

      args = Array.prototype.slice.call(arguments);
      args[0] = opts;

      return this._request.apply(this, args);
    } else if (!opts) {
      args = Array.prototype.slice.call(arguments);
      args[0] = {};

      return this._request.apply(this, args);
    }

    opts.method = reqMethod;

    return this._request.apply(this, arguments);
  };
});

/**
 * Module exports.
 */

exports.Client = Client;


/***/ }),

/***/ 660:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Agent check
 */



/**
 * Module dependencies.
 */

var errors = __webpack_require__(995);
var utils = __webpack_require__(293);

/**
 * Initialize a new `AgentCheck` client.
 */

function AgentCheck(consul) {
  this.consul = consul;
}

/**
 * Returns the checks the local agent is managing
 */

AgentCheck.prototype.list = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'agent.check.list',
    path: '/agent/checks',
  };

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Registers a new local check
 */

AgentCheck.prototype.register = function(opts, callback) {
  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'agent.check.register',
    path: '/agent/check/register',
    type: 'json',
  };

  try {
    req.body = utils.createCheck(opts);
  } catch (err) {
    return callback(this.consul._err(errors.Validation(err.message), req));
  }

  utils.options(req, opts);

  this.consul._put(req, utils.empty, callback);
};

/**
 * Deregister a local check
 */

AgentCheck.prototype.deregister = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'agent.check.deregister',
    path: '/agent/check/deregister/{id}',
    params: { id: opts.id },
  };

  if (!opts.id) {
    return callback(this.consul._err(errors.Validation('id required'), req));
  }

  utils.options(req, opts);

  this.consul._put(req, utils.empty, callback);
};

/**
 * Mark a local test as passing
 */

AgentCheck.prototype.pass = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'agent.check.pass',
    path: '/agent/check/pass/{id}',
    params: { id: opts.id },
    query: {},
  };

  if (!opts.id) {
    return callback(this.consul._err(errors.Validation('id required'), req));
  }

  if (opts.note) req.query.note = opts.note;

  utils.options(req, opts);

  this.consul._put(req, utils.empty, callback);
};

/**
 * Mark a local test as warning
 */

AgentCheck.prototype.warn = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'agent.check.warn',
    path: '/agent/check/warn/{id}',
    params: { id: opts.id },
    query: {},
  };

  if (!opts.id) {
    return callback(this.consul._err(errors.Validation('id required'), req));
  }

  if (opts.note) req.query.note = opts.note;

  utils.options(req, opts);

  this.consul._put(req, utils.empty, callback);
};

/**
 * Mark a local test as critical
 */

AgentCheck.prototype.fail = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'agent.check.fail',
    path: '/agent/check/fail/{id}',
    params: { id: opts.id },
    query: {},
  };

  if (!opts.id) {
    return callback(this.consul._err(errors.Validation('id required'), req));
  }

  if (opts.note) req.query.note = opts.note;

  utils.options(req, opts);

  this.consul._put(req, utils.empty, callback);
};

/**
 * Module Exports.
 */

exports.AgentCheck = AgentCheck;


/***/ }),

/***/ 661:
/***/ (function(__unusedmodule, exports) {

"use strict";
/**
 * Constants
 */



/**
 * Default options
 */

exports.DEFAULT_OPTIONS = [
  'consistent',
  'dc',
  'stale',
  'timeout',
  'token',
  'wait',
  'wan',
];

/**
 * Values
 */

exports.AGENT_STATUS = [
  'none',
  'alive',
  'leaving',
  'left',
  'failed',
];

exports.CHECK_STATE = [
  'unknown',
  'passing',
  'warning',
  'critical',
];

/**
 * Time
 */

var du = exports.DURATION_UNITS = { ns: 1 };
du.us = 1000 * du.ns;
du.ms = 1000 * du.us;
du.s = 1000 * du.ms;
du.m = 60 * du.s;
du.h = 60 * du.m;


/***/ }),

/***/ 669:
/***/ (function(module) {

module.exports = require("util");

/***/ }),

/***/ 681:
/***/ (function(module) {

// This file has been generated from mustache.mjs
(function (global, factory) {
   true ? module.exports = factory() :
  undefined;
}(this, (function () { 'use strict';

  /*!
   * mustache.js - Logic-less {{mustache}} templates with JavaScript
   * http://github.com/janl/mustache.js
   */

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  /**
   * Safe way of detecting whether or not the given thing is a primitive and
   * whether it has the given property
   */
  function primitiveHasOwnProperty (primitive, propName) {
    return (
      primitive != null
      && typeof primitive !== 'object'
      && primitive.hasOwnProperty
      && primitive.hasOwnProperty(propName)
    );
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   *
   * Tokens for partials also contain two more elements: 1) a string value of
   * indendation prior to that tag and 2) the index of that tag on that line -
   * eg a value of 2 indicates the partial is the third tag on this line.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];
    var lineHasNonSpace = false;
    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?
    var indentation = '';  // Tracks indentation for tags that use it
    var tagIndex = 0;      // Stores a count of number of tags encountered on a line

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
            indentation += chr;
          } else {
            nonSpace = true;
            lineHasNonSpace = true;
            indentation += ' ';
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n') {
            stripSpace();
            indentation = '';
            tagIndex = 0;
            lineHasNonSpace = false;
          }
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      if (type == '>') {
        token = [ type, value, start, scanner.pos, indentation, tagIndex, lineHasNonSpace ];
      } else {
        token = [ type, value, start, scanner.pos ];
      }
      tagIndex++;
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    stripSpace();

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, intermediateValue, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          intermediateValue = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           *
           * In the case where dot notation is used, we consider the lookup
           * to be successful even if the last "object" in the path is
           * not actually an object but a primitive (e.g., a string, or an
           * integer), because it is sometimes useful to access a property
           * of an autoboxed primitive, such as the length of a string.
           **/
          while (intermediateValue != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = (
                hasProperty(intermediateValue, names[index])
                || primitiveHasOwnProperty(intermediateValue, names[index])
              );

            intermediateValue = intermediateValue[names[index++]];
          }
        } else {
          intermediateValue = context.view[name];

          /**
           * Only checking against `hasProperty`, which always returns `false` if
           * `context.view` is not an object. Deliberately omitting the check
           * against `primitiveHasOwnProperty` if dot notation is not used.
           *
           * Consider this example:
           * ```
           * Mustache.render("The length of a football field is {{#length}}{{length}}{{/length}}.", {length: "100 yards"})
           * ```
           *
           * If we were to check also against `primitiveHasOwnProperty`, as we do
           * in the dot notation case, then render call would return:
           *
           * "The length of a football field is 9."
           *
           * rather than the expected:
           *
           * "The length of a football field is 100 yards."
           **/
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit) {
          value = intermediateValue;
          break;
        }

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` according to the given `tags` or
   * `mustache.tags` if `tags` is omitted,  and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.cache;
    var cacheKey = template + ':' + (tags || mustache.tags).join(':');
    var tokens = cache[cacheKey];

    if (tokens == null)
      tokens = cache[cacheKey] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   *
   * If the optional `tags` argument is given here it must be an array with two
   * string values: the opening and closing tags used in the template (e.g.
   * [ "<%", "%>" ]). The default is to mustache.tags.
   */
  Writer.prototype.render = function render (template, view, partials, tags) {
    var tokens = this.parse(template, tags);
    var context = (view instanceof Context) ? view : new Context(view, undefined);
    return this.renderTokens(tokens, context, partials, template, tags);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate, tags) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, tags);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.indentPartial = function indentPartial (partial, indentation, lineHasNonSpace) {
    var filteredIndentation = indentation.replace(/[^ \t]/g, '');
    var partialByNl = partial.split('\n');
    for (var i = 0; i < partialByNl.length; i++) {
      if (partialByNl[i].length && (i > 0 || !lineHasNonSpace)) {
        partialByNl[i] = filteredIndentation + partialByNl[i];
      }
    }
    return partialByNl.join('\n');
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials, tags) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null) {
      var lineHasNonSpace = token[6];
      var tagIndex = token[5];
      var indentation = token[4];
      var indentedValue = value;
      if (tagIndex == 0 && indentation) {
        indentedValue = this.indentPartial(value, indentation, lineHasNonSpace);
      }
      return this.renderTokens(this.parse(indentedValue, tags), context, partials, indentedValue);
    }
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  var mustache = {
    name: 'mustache.js',
    version: '3.2.1',
    tags: [ '{{', '}}' ],
    clearCache: undefined,
    escape: undefined,
    parse: undefined,
    render: undefined,
    to_html: undefined,
    Scanner: undefined,
    Context: undefined,
    Writer: undefined
  };

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer. If the optional `tags` argument is given here it must be an
   * array with two string values: the opening and closing tags used in the
   * template (e.g. [ "<%", "%>" ]). The default is to mustache.tags.
   */
  mustache.render = function render (template, view, partials, tags) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials, tags);
  };

  // This is here for backwards compatibility with 0.4.x.,
  /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html (template, view, partials, send) {
    /*eslint-enable*/

    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  return mustache;

})));


/***/ }),

/***/ 706:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Catalog service
 */



/**
 * Module dependencies.
 */

var errors = __webpack_require__(995);
var utils = __webpack_require__(293);

/**
 * Initialize a new `CatalogService` client.
 */

function CatalogService(consul) {
  this.consul = consul;
}

/**
 * Lists services in a given DC
 */

CatalogService.prototype.list = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  } else if (typeof opts === 'string') {
    opts = { dc: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'catalog.service.list',
    path: '/catalog/services',
    query: {},
  };

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Lists the nodes in a given service
 */

CatalogService.prototype.nodes = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { service: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'catalog.service.nodes',
    path: '/catalog/service/{service}',
    params: { service: opts.service },
    query: {},
  };

  if (!opts.service) {
    return callback(this.consul._err(errors.Validation('service required'), req));
  }
  if (opts.tag) req.query.tag = opts.tag;

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Module Exports.
 */

exports.CatalogService = CatalogService;


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 783:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Catalog node
 */



/**
 * Module dependencies.
 */

var errors = __webpack_require__(995);
var utils = __webpack_require__(293);

/**
 * Initialize a new `CatalogNode` client.
 */

function CatalogNode(consul) {
  this.consul = consul;
}

/**
 * Lists nodes in a given DC
 */

CatalogNode.prototype.list = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  } else if (typeof opts === 'string') {
    opts = { dc: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'catalog.node.list',
    path: '/catalog/nodes',
  };

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Lists the services provided by a node
 */

CatalogNode.prototype.services = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { node: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'catalog.node.services',
    path: '/catalog/node/{node}',
    params: { node: opts.node },
  };

  if (!opts.node) {
    return callback(this.consul._err(errors.Validation('node required'), req));
  }

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Module Exports.
 */

exports.CatalogNode = CatalogNode;


/***/ }),

/***/ 784:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Watch.
 */



/**
 * Module dependencies.
 */

var events = __webpack_require__(614);
var util = __webpack_require__(669);

var errors = __webpack_require__(995);
var utils = __webpack_require__(293);

/**
 * Initialize a new `Watch` instance.
 */

function Watch(consul, opts) {
  var self = this;

  events.EventEmitter.call(self);

  opts = utils.normalizeKeys(opts);

  var options = utils.normalizeKeys(opts.options || {});
  options = utils.defaults(options, consul._defaults);
  options.wait = options.wait || '30s';
  options.index = options.index || '0';

  if (typeof options.timeout !== 'string' && typeof options.timeout !== 'number') {
    var wait = utils.parseDuration(options.wait);
    // A small random amount of additional wait time is added to the supplied
    // maximum wait time to spread out the wake up time of any concurrent
    // requests. This adds up to wait / 16 additional time to the maximum duration.
    options.timeout = Math.ceil(wait + Math.max(wait * 0.1, 500));
  }

  var backoffFactor = 100;
  if (opts.hasOwnProperty('backofffactor') && typeof opts.backofffactor === 'number') {
    backoffFactor = opts.backofffactor;
  }
  var backoffMax = 30 * 1000;
  if (opts.hasOwnProperty('backoffmax') && typeof opts.backoffmax === 'number') {
    backoffMax = opts.backoffmax;
  }
  var maxAttempts = -1;
  if (opts.hasOwnProperty('maxattempts') && typeof opts.maxattempts === 'number') {
    maxAttempts = opts.maxattempts;
  }

  self._context = { consul: consul };
  self._options = options;
  self._attempts = 0;
  self._maxAttempts = maxAttempts;
  self._backoffMax = backoffMax;
  self._backoffFactor = backoffFactor;
  self._method = opts.method;

  if (typeof opts.method !== 'function') {
    throw errors.Validation('method required');
  }

  process.nextTick(function() { self._run(); });
}

util.inherits(Watch, events.EventEmitter);

/**
 * Object meta
 */

Watch.meta = {};

/**
 * Is running
 */

Watch.meta.isRunning = { type: 'sync' };

Watch.prototype.isRunning = function() {
  return !this._end;
};

/**
 * Update time
 */

Watch.meta.updateTime = { type: 'sync' };

Watch.prototype.updateTime = function() {
  return this._updateTime;
};

/**
 * End watch
 */

Watch.meta.end = { type: 'sync' };

Watch.prototype.end = function() {
  if (this._end) return;
  this._end = true;

  this.emit('cancel');
  this.emit('end');
};

/**
 * Wait
 */

Watch.prototype._wait = function() {
  this._attempts += 1;
  if (this._attemptsMaxed) {
    return this._backoffMax;
  }
  var timeout = Math.pow(2, this._attempts) * this._backoffFactor;
  if (timeout < this._backoffMax) {
    return timeout;
  } else {
    this._attemptsMaxed = true;
    return this._backoffMax;
  }
};

/**
 * Error helper
 */

Watch.prototype._err = function(err, res) {
  var self = this;

  if (self._end) return;

  self.emit('error', err, res);

  if (err && err.isValidation) return self.end();
  if (res && res.statusCode === 400) return self.end();
  if (self._maxAttempts >= 0 && self._attempts >= self._maxAttempts) return self.end();

  utils.setTimeoutContext(function() { self._run(); }, self, self._wait());
};

/**
 * Run
 */

Watch.prototype._run = function() {
  var self = this;

  if (self._end) return;

  var opts = utils.clone(self._options);
  opts.ctx = self;

  try {
    self._method.call(self._context, opts, function(err, data, res) {
      if (err) {
        return self._err(err, res);
      }

      self._updateTime = +new Date();

      self._attempts = 0;
      self._attemptsMaxed = false;

      var newIndex = res.headers['x-consul-index'];

      if (newIndex === undefined) {
        return self._err(errors.Validation('Watch not supported'), res);
      }

      if (utils.hasIndexChanged(newIndex, self._options.index)) {
        self._options.index = newIndex;

        self.emit('change', data, res);
      }

      process.nextTick(function() { self._run(); });
    });
  } catch (err) {
    self._err(err);
  }
};

/**
 * Module exports.
 */

exports.Watch = Watch;


/***/ }),

/***/ 810:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Lock.
 */



/**
 * Module dependencies.
 */

var events = __webpack_require__(614);
var util = __webpack_require__(669);

var errors = __webpack_require__(995);
var utils = __webpack_require__(293);

/**
 * Constants
 */

var DEFAULT_LOCK_SESSION_NAME = 'Consul API Lock';
var DEFAULT_LOCK_SESSION_TTL = '15s';
var DEFAULT_LOCK_WAIT_TIME = '15s';
var DEFAULT_LOCK_WAIT_TIMEOUT = '1s';
var DEFAULT_LOCK_RETRY_TIME = '5s';

// magic flag 0x2ddccbc058a50c18
var LOCK_FLAG_VALUE = '3304740253564472344';

/**
 * Initialize a new `Lock` instance.
 */

function Lock(consul, opts) {
  events.EventEmitter.call(this);

  opts = utils.normalizeKeys(opts);

  this.consul = consul;
  this._opts = opts;
  this._defaults = utils.defaultCommonOptions(opts);

  if (opts.session) {
    switch (typeof opts.session) {
      case 'string':
        opts.session = { id: opts.session };
        break;
      case 'object':
        opts.session = utils.normalizeKeys(opts.session);
        break;
      default:
        throw errors.Validation('session must be an object or string');
    }
  } else {
    opts.session = {};
  }

  if (!opts.key) {
    throw errors.Validation('key required');
  } else if (typeof opts.key !== 'string') {
    throw errors.Validation('key must be a string');
  }
}

util.inherits(Lock, events.EventEmitter);

/**
 * Object meta
 */

Lock.meta = {};

/**
 * Acquire lock
 */

Lock.meta.acquire = { type: 'sync' };

Lock.prototype.acquire = function() {
  var self = this;

  if (self._ctx) throw new errors.Validation('lock in use');

  var ctx = self._ctx = new events.EventEmitter();

  ctx.key = self._opts.key;
  ctx.session = utils.clone(self._opts.session);
  ctx.index = '0';
  ctx.end = false;
  ctx.lockWaitTime = self._opts.lockwaittime || DEFAULT_LOCK_WAIT_TIME;
  ctx.lockWaitTimeout = utils.parseDuration(ctx.lockWaitTime) +
    utils.parseDuration(self._opts.lockwaittimeout || DEFAULT_LOCK_WAIT_TIMEOUT);
  ctx.lockRetryTime = utils.parseDuration(self._opts.lockretrytime || DEFAULT_LOCK_RETRY_TIME);
  ctx.state = 'session';
  ctx.value = self._opts.value || null;

  process.nextTick(function() {
    self._run(ctx);
  });
};

/**
 * Release lock
 */

Lock.meta.release = { type: 'sync' };

Lock.prototype.release = function() {
  var self = this;

  var ctx = self._ctx;

  if (!self._ctx) throw errors.Validation('no lock in use');

  delete self._ctx;

  process.nextTick(function() {
    self._release(ctx);
  });
};

/**
 * Error helper
 */

Lock.prototype._err = function(err, res) {
  var self = this;

  self.emit('error', err, res);
};

/**
 * Lock
 */

Lock.prototype._run = function(ctx) {
  if (ctx.end) return;

  switch (ctx.state) {
    case 'session':
      return this._session(ctx);
    case 'wait':
      return this._wait(ctx);
    case 'acquire':
      return this._acquire(ctx);
    case 'monitor':
      return this._monitor(ctx);
    default:
      throw new Error('invalid state: ' + ctx.state);
  }
};

/**
 * Create lock session
 */

Lock.prototype._session = function(ctx) {
  var self = this;

  if (!ctx.session.id) {
    var opts = utils.defaults({
      name: ctx.session.name || DEFAULT_LOCK_SESSION_NAME,
      ttl: ctx.session.ttl || DEFAULT_LOCK_SESSION_TTL,
      ctx: ctx,
    }, ctx.session, self._defaults, self.consul._defaults);

    self.consul.session.create(opts, function(err, data, res) {
      if (err) {
        err.message = 'session create: ' + err.message;
        return self._end(ctx, err, res);
      }

      ctx.session = {
        id: data.ID,
        ttl: opts.ttl,
      };

      ctx.state = 'wait';

      var renewTimeout = utils.parseDuration(ctx.session.ttl) / 2;

      // renew session
      ctx.renewSession = setInterval(function() {
        var opts = utils.defaults({
          id: ctx.session.id,
          timeout: renewTimeout,
          ctx: ctx,
        }, self._defaults, self.consul._defaults);

        self.consul.session.renew(opts, function(err, data, res) {
          if (err) self._end(ctx, err, res);
        });
      }, renewTimeout);

      return self._run(ctx);
    });

    return;
  }

  ctx.state = 'wait';

  process.nextTick(function() {
    self._run(ctx);
  });
};

/**
 * Wait for non-locked resource
 */

Lock.prototype._wait = function(ctx) {
  var self = this;

  var retry = function() {
    utils.setTimeoutContext(function() {
      self._run(ctx);
    }, ctx, ctx.lockRetryTime);
  };

  var opts = utils.defaults({
    key: ctx.key,
    wait: ctx.lockWaitTime,
    timeout: ctx.lockWaitTimeout,
    ctx: ctx,
    index: ctx.index,
  }, self._defaults, self.consul._defaults);

  self.consul.kv.get(opts, function(err, data, res) {
    if (err) return self._end(ctx, err, res);

    if (data) {
      // we try to use the same magic number as consul/api in an attempt to be
      // compatible
      if (data.Flags !== +LOCK_FLAG_VALUE) {
        err = errors.Validation('consul: lock: existing key does not match lock use');
        return self._end(ctx, err, res);
      }

      var newIndex = res.headers['x-consul-index'];
      if (utils.hasIndexChanged(newIndex, ctx.index)) ctx.index = newIndex;

      if (data.Session !== ctx.Session) {
        self.emit('retry', { leader: data.Session });
        return retry();
      }
    } else if (res.statusCode !== 404) {
      return self._end(ctx, new Error('consul: lock: error getting key'), res);
    }

    ctx.state = 'acquire';

    self._run(ctx);
  });
};

/**
 * Attempt to acquire lock
 */

Lock.prototype._acquire = function(ctx) {
  var self = this;

  var opts = utils.defaults({
    key: ctx.key,
    acquire: ctx.session.id,
    ctx: ctx,
    value: ctx.value,
    flags: LOCK_FLAG_VALUE,
  }, self._defaults, self.consul._defaults);

  self.consul.kv.set(opts, function(err, data, res) {
    if (err) return self._end(ctx, err, res);

    if (data !== true) {
      ctx.state = 'wait';

      return utils.setTimeoutContext(function() { self._run(ctx); }, ctx,
        ctx.lockRetryTime);
    }

    ctx.held = true;
    self.emit('acquire');

    ctx.state = 'monitor';

    self._run(ctx);
  });
};

/**
 * Monitor lock
 */

Lock.prototype._monitor = function(ctx) {
  var self = this;

  var monitor = ctx.monitor = self.consul.watch({
    method: self.consul.kv.get,
    options: utils.defaults({
      key: ctx.key,
      wait: ctx.lockWaitTime,
      timeout: ctx.lockWaitTimeout,
      index: ctx.index,
    }, self._defaults, self.consul._defaults),
  });

  var ttl = ctx.session.ttl && utils.parseDuration(ctx.session.ttl);

  // monitor updates
  if (ttl) {
    utils.setIntervalContext(function() {
      var time = monitor.updateTime();

      if (time && new Date() - time > ttl + 1000) {
        monitor.end();
      }
    }, ctx, Math.min(1000, ttl));
  }

  monitor.on('change', function(data) {
    if (data) {
      if (data.Session !== ctx.session.id) {
        return monitor.end();
      }
    }
  });

  monitor.on('error', function() {
    // ignore errors
  });

  monitor.on('end', function() {
    self._end(ctx);
  });
};

/**
 * Close context processes
 */

Lock.prototype._end = function(ctx, err, res) {
  var self = this;

  if (ctx.end) return;
  ctx.end = true;

  delete self._ctx;

  if (err) self._err(err, res);

  if (ctx.monitor) {
    ctx.monitor.removeAllListeners();
    ctx.monitor.end();

    delete ctx.monitor;
  }

  if (ctx.renewSession) {
    clearInterval(ctx.renewSession);

    var opts = utils.defaults({
      id: ctx.session.id,
      timeout: 1000,
    }, self._defaults, self.consul._defaults);

    self.consul.session.destroy(opts, function() {
      // ignore errors
    });

    delete ctx.renewSession;
  }

  // abort any pending requests
  ctx.emit('cancel');

  if (ctx.held) {
    ctx.held = false;
    self.emit('release');
  }

  self.emit('end');
};

/**
 * Release lock
 */

Lock.prototype._release = function(ctx) {
  var self = this;

  if (ctx.held) {
    var opts = utils.defaults({
      key: ctx.key,
      release: ctx.session.id,
      ctx: ctx,
      value: ctx.value,
      flags: LOCK_FLAG_VALUE,
    }, self._defaults, self.consul._defaults);

    self.consul.kv.set(opts, function(err, data) {
      if (err) return self._end(ctx, err);

      if (data !== true) {
        err = new Error('failed to release lock');
        return self._end(ctx, err);
      }

      self._end(ctx);
    });

    return;
  }

  process.nextTick(function() {
    self._end(ctx);
  });
};

/**
 * Module exports.
 */

exports.Lock = Lock;


/***/ }),

/***/ 823:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Manage catalog
 */



/**
 * Module dependencies.
 */

var CatalogNode = __webpack_require__(783).CatalogNode;
var CatalogService = __webpack_require__(706).CatalogService;
var CatalogConnect = __webpack_require__(254).CatalogConnect;
var utils = __webpack_require__(293);

/**
 * Initialize a new `Catalog` client.
 */

function Catalog(consul) {
  this.consul = consul;
  this.connect = new Catalog.Connect(consul);
  this.node = new Catalog.Node(consul);
  this.service = new Catalog.Service(consul);
}

Catalog.Connect = CatalogConnect;
Catalog.Node = CatalogNode;
Catalog.Service = CatalogService;

/**
 * Lists known datacenters
 */

Catalog.prototype.datacenters = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'catalog.datacenters',
    path: '/catalog/datacenters',
  };

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Lists nodes in a given DC
 */

Catalog.prototype.nodes = function() {
  this.node.list.apply(this.node, arguments);
};

/**
 * Lists services in a given DC
 */

Catalog.prototype.services = function() {
  this.service.list.apply(this.service, arguments);
};

/**
 * Module exports.
 */

exports.Catalog = Catalog;


/***/ }),

/***/ 835:
/***/ (function(module) {

module.exports = require("url");

/***/ }),

/***/ 840:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * ACL manipulation
 */



/**
 * Module dependencies.
 */

var errors = __webpack_require__(995);
var utils = __webpack_require__(293);

/**
 * Initialize a new `Acl` client.
 */

function Acl(consul) {
  this.consul = consul;
}

/**
 * Creates one-time management token if not configured
 */

Acl.prototype.bootstrap = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'acl.bootstrap',
    path: '/acl/bootstrap',
    type: 'json',
  };

  utils.options(req, opts);

  this.consul._put(req, utils.body, callback);
};

/**
 * Creates a new token with policy
 */

Acl.prototype.create = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'acl.create',
    path: '/acl/create',
    query: {},
    type: 'json',
    body: {},
  };

  if (opts.name) req.body.Name = opts.name;
  if (opts.type) req.body.Type = opts.type;
  if (opts.rules) req.body.Rules = opts.rules;

  utils.options(req, opts);

  this.consul._put(req, utils.body, callback);
};

/**
 * Update the policy of a token
 */

Acl.prototype.update = function(opts, callback) {
  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'acl.update',
    path: '/acl/update',
    query: {},
    type: 'json',
    body: {},
  };

  if (!opts.id) {
    return callback(this.consul._err(errors.Validation('id required'), req));
  }

  req.body.ID = opts.id;

  if (opts.name) req.body.Name = opts.name;
  if (opts.type) req.body.Type = opts.type;
  if (opts.rules) req.body.Rules = opts.rules;

  utils.options(req, opts);

  this.consul._put(req, utils.empty, callback);
};

/**
 * Destroys a given token
 */

Acl.prototype.destroy = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'acl.destroy',
    path: '/acl/destroy/{id}',
    params: { id: opts.id },
    query: {},
  };

  if (!opts.id) {
    return callback(this.consul._err(errors.Validation('id required'), req));
  }

  utils.options(req, opts);

  this.consul._put(req, utils.empty, callback);
};

/**
 * Queries the policy of a given token
 */

Acl.prototype.info = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'acl.info',
    path: '/acl/info/{id}',
    params: { id: opts.id },
    query: {},
  };

  if (!opts.id) {
    return callback(this.consul._err(errors.Validation('id required'), req));
  }

  utils.options(req, opts);

  this.consul._get(req, utils.bodyItem, callback);
};

Acl.prototype.get = Acl.prototype.info;

/**
 * Creates a new token by cloning an existing token
 */

Acl.prototype.clone = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'acl.clone',
    path: '/acl/clone/{id}',
    params: { id: opts.id },
    query: {},
  };

  if (!opts.id) {
    return callback(this.consul._err(errors.Validation('id required'), req));
  }

  utils.options(req, opts);

  this.consul._put(req, utils.body, callback);
};

/**
 * Lists all the active tokens
 */

Acl.prototype.list = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'acl.list',
    path: '/acl/list',
    query: {},
  };

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Check ACL replication
 */

Acl.prototype.replication = function(opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'acl.replication',
    path: '/acl/replication',
    query: {},
  };

  utils.options(req, opts);

  this.consul._get(req, utils.body, callback);
};

/**
 * Module exports.
 */

exports.Acl = Acl;


/***/ }),

/***/ 884:
/***/ (function(module) {

module.exports = {"_from":"papi@^0.29.0","_id":"papi@0.29.1","_inBundle":false,"_integrity":"sha512-Y9ipSMfWuuVFO3zY9PlxOmEg+bQ7CeJ28sa9/a0veYNynLf9fwjR3+3fld5otEy7okUaEOUuCHVH62MyTmACXQ==","_location":"/papi","_phantomChildren":{},"_requested":{"type":"range","registry":true,"raw":"papi@^0.29.0","name":"papi","escapedName":"papi","rawSpec":"^0.29.0","saveSpec":null,"fetchSpec":"^0.29.0"},"_requiredBy":["/consul"],"_resolved":"https://registry.npmjs.org/papi/-/papi-0.29.1.tgz","_shasum":"7373e2c527f5117d61fd2a0e6c6b1dd72bf7f180","_spec":"papi@^0.29.0","_where":"/home/seth/dev/hexly/ops/githubActions/consul-values/node_modules/consul","author":{"name":"Silas Sewell","email":"silas@sewell.org"},"bugs":{"url":"https://github.com/silas/node-papi/issues"},"bundleDependencies":false,"deprecated":false,"description":"Build HTTP API clients","devDependencies":{"async":"^2.6.1","bluebird":"^3.5.1","debug":"^3.1.0","istanbul":"^0.4.5","jscs":"^3.0.7","jshint":"^2.9.5","lodash":"^4.17.10","mocha":"^5.2.0","nock":"^9.3.2","request":"^2.87.0","should":"^13.2.1","sinon":"^1.10.3"},"homepage":"https://github.com/silas/node-papi","keywords":["api","client","http","rest"],"license":"MIT","main":"lib","name":"papi","repository":{"type":"git","url":"git+https://github.com/silas/node-papi.git"},"scripts":{"bench":"BENCHMARK=true mocha test/benchmark.js","cover":"istanbul cover _mocha -- --recursive && open coverage/lcov-report/index.html","test":"jshint lib test && jscs lib test && istanbul cover _mocha -- --recursive --check-leaks --globals Promise && istanbul check-coverage --statements 100 --functions 100 --branches 100 --lines 100"},"version":"0.29.1"};

/***/ }),

/***/ 888:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(369);
const {parseTemplate} = __webpack_require__(198);

(async () => {
    try {
        await core.group('Parse template', parseTemplate);
    } catch (error) {
        core.setFailed(error.message);
    }
})();

/***/ }),

/***/ 948:
/***/ (function(__unusedmodule, exports) {

"use strict";
/**
 * Errors
 */



/**
 * Create
 */

function create(message) {
  var error = message instanceof Error ?
    message :
    new Error(message ? message : undefined);

  error.isPapi = true;

  return error;
}

/**
 * Codec
 */

function codec(message) {
  var error = create(message);

  error.isCodec = true;

  return error;
}

/**
 * Response
 */

function response(message) {
  var error = create(message);

  error.isResponse = true;

  return error;
}

/**
 * Abort
 */

function abort(message) {
  var error = create(message);

  error.isAbort = true;

  return error;
}

/**
 * Timeout
 */

function timeout(message) {
  var error = create(message);

  error.isTimeout = true;

  return error;
}

/**
 * Validation
 */

function validation(message) {
  var error = create(message);

  error.isValidation = true;

  return error;
}

/**
 * Module exports.
 */

exports.Codec = codec;
exports.Response = response;
exports.Abort = abort;
exports.Timeout = timeout;
exports.Validation = validation;
exports.create = create;


/***/ }),

/***/ 974:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
/**
 * Events
 */



/**
 * Module dependencies.
 */

var errors = __webpack_require__(995);
var utils = __webpack_require__(293);

/**
 * Initialize a new `Event` client.
 */

function Event(consul) {
  this.consul = consul;
}

/**
 * Fires a new user event
 */

Event.prototype.fire = function(opts, callback) {
  var options;
  if (arguments.length === 3) {
    options = {
      name: arguments[0],
      payload: arguments[1],
    };
    callback = arguments[2];
  } else if (typeof opts === 'string') {
    options = { name: opts };
  } else {
    options = opts;
  }

  options = utils.normalizeKeys(options);
  options = utils.defaults(options, this.consul._defaults);

  var req = {
    name: 'event.fire',
    path: '/event/fire/{name}',
    params: { name: options.name },
    query: {},
  };

  if (!options.name) {
    return callback(this.consul._err(errors.Validation('name required'), req));
  }

  var buffer;

  if (options.hasOwnProperty('payload')) {
    buffer = Buffer.isBuffer(options.payload);
    req.body = buffer ? options.payload : Buffer.from(options.payload);
  }
  if (options.node) req.query.node = options.node;
  if (options.service) req.query.service = options.service;
  if (options.tag) req.query.tag = options.tag;

  utils.options(req, options);

  this.consul._put(req, utils.body, function(err, data, res) {
    if (err) return callback(err, undefined, res);

    if (data.hasOwnProperty('Payload')) {
      data.Payload = utils.decode(data.Payload, { buffer: buffer });
    }

    callback(null, data, res);
  });
};

/**
 * Lists the most recent events an agent has seen
 */

Event.prototype.list = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { name: opts };
  } else if (!callback) {
    callback = opts;
    opts = {};
  }

  opts = utils.normalizeKeys(opts);
  opts = utils.defaults(opts, this.consul._defaults);

  var req = {
    name: 'event.list',
    path: '/event/list',
    query: {},
  };

  if (opts.name) req.query.name = opts.name;

  utils.options(req, opts);

  this.consul._get(req, utils.body, function(err, data, res) {
    if (err) return callback(err, undefined, res);

    data.forEach(function(item) {
      if (!item.hasOwnProperty('Payload')) return;
      item.Payload = utils.decode(item.Payload, opts);
    });

    callback(null, data, res);
  });
};

/**
 * Module exports.
 */

exports.Event = Event;


/***/ }),

/***/ 995:
/***/ (function(__unusedmodule, exports) {

"use strict";
/**
 * Errors
 */



/**
 * Create
 */

function create(message) {
  var error = message instanceof Error ?
    message :
    new Error(message ? message : undefined);

  error.isConsul = true;

  return error;
}

/**
 * Validation
 */

function validation(message) {
  var error = create(message);

  error.isValidation = true;

  return error;
}

/**
 * Module exports.
 */

exports.Consul = create;
exports.Validation = validation;


/***/ }),

/***/ 998:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


/**
 * Module dependencies.
 */

var codecs = __webpack_require__(107);

/**
 * Constants
 */

exports.CHARSET = 'utf-8';

exports.ENCODERS = {
  'application/json': codecs.json.encode,
  'application/x-www-form-urlencoded': codecs.form.encode,
  'text/plain': codecs.text.encode,
};

exports.DECODERS = {
  'application/json': codecs.json.decode,
  'application/x-www-form-urlencoded': codecs.form.decode,
  'text/html': codecs.text.decode,
  'text/json': codecs.json.decode,
  'text/plain': codecs.text.decode,
};

exports.METHODS = [
  'options',
  'get',
  'head',
  'post',
  'put',
  'delete',
  'patch',
];

exports.MIME_ALIAS = {
  form: 'application/x-www-form-urlencoded',
  json: 'application/json',
  qs: 'application/x-www-form-urlencoded',
  querystring: 'application/x-www-form-urlencoded',
  text: 'text/plain',
};

exports.EXCLUDE_CONTENT_LENGTH = [
  'GET',
  'HEAD',
  'OPTIONS',
];

exports.CLIENT_OPTIONS = [
  'agent',
  // tls
  'ca',
  'cert',
  'ciphers',
  'clientCertEngine',
  'crl',
  'dhparam',
  'ecdhCurve',
  'honorCipherOrder',
  'key',
  'passphrase',
  'pfx',
  'rejectUnauthorized',
  'secureOptions',
  'secureProtocol',
  'servername',
  'sessionIdContext',
];

exports.REQUEST_OPTIONS = exports.CLIENT_OPTIONS.concat([
  'method',
]);


/***/ })

/******/ });