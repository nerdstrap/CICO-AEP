define(function(require) {
    'use strict';

    var _ = require('underscore');

    // In case we forget to take out console statements. IE becomes very unhappy when we forget. Let's not make IE unhappy
    if (typeof (window.console) === 'undefined') {
        window.console = {};
        window.console.log = window.console.error = window.console.info = window.console.debug = window.console.warn = window.console.trace = window.console.dir = window.console.dirxml = window.console.group = window.console.groupEnd = window.console.time = window.console.timeEnd = window.console.assert = window.console.profile = function() {
        };
        window.console.table = function() {
        };
    }

    var console = window.console;
    if (!(console.debug)) {
        console.debug = console.log;
    }
    if (!(console.trace)) {
        console.trace = console.log;
    }

    // manage IE8 & 9
    var methods = ['log', 'debug', 'trace', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd', 'table'];
    if (typeof console.log === 'object') {
        _.each(methods, function(method) {
            console['_' + method] = console[method];
            console[method] = function(msg) {
                console['_' + method](msg);
            };
        });
    }

    // Can be customized if needed
    console.levels = ['debug', 'trace', 'info', 'warn', 'error', 'log'];

    // Disabled by default
    console._level = 'warn';

    console.getLevel = function() {
        return console._level;
    };

    console.setLevel = function(level) {
        console._level = level;
    };

    var enabledFor = function(level) {
        if (console.getLevel() === 'off') {
            return false;
        }
        var strategy = console.getLevel();
        if (_.indexOf(console.levels, level) === -1) {
            throw new Error('Invalid log level "' + strategy + '", must be one of ' + JSON.stringify(console.levels));
        }
        if (_.indexOf(console.levels, console.getLevel()) === -1) {
            throw new Error('Invalid log console.level "' + strategy + '", must be one of ' + JSON.stringify(console.levels));
        }
        return _.indexOf(console.levels, level) >= _.indexOf(console.levels, console.getLevel());
    };

    var log = console.log;
    var debug = console.debug;
    var trace = console.trace;
    var info = console.info;
    var warn = console.warn;
    var error = console.error;
    var table = console.table;

    // console.log = console.debug
    console.log = function() {
        if (enabledFor('log')) {
            log.apply(this, Array.prototype.slice.call(arguments));
        }
    };
    console.debug = function() {
        if (enabledFor('debug')) {
            debug.apply(this, Array.prototype.slice.call(arguments));
        }
    };
    console.trace = function() {
        if (enabledFor('trace')) {
            trace.apply(this, Array.prototype.slice.call(arguments));
        }
    };
    console.info = function() {
        if (enabledFor('info')) {
            info.apply(this, Array.prototype.slice.call(arguments));
        }
    };
    console.warn = function() {
        if (enabledFor('warn')) {
            warn.apply(this, Array.prototype.slice.call(arguments));
        }
    };
    console.error = function() {
        if (enabledFor('error')) {
            error.apply(this, Array.prototype.slice.call(arguments));
        }
    };
    console.table = function() {
        if (enabledFor('table')) {
            table.apply(this, Array.prototype.slice.call(arguments));
        }
    };

    // manage global JS errors
    window.onerror = function(message, url, linenumber) {
        console.log(message);
    };
});
