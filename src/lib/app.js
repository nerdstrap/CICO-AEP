'use strict';

var consolePolyfill = require('console-polyfill');

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var CoreRouter = require('routers/CoreRouter');

var handlebarsHelpers = require('lib/handlebars.helpers');
var coreRouterInstance = new CoreRouter();

Backbone.history.start();