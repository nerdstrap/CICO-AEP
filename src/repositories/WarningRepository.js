'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var _warnings = require('repositories/warnings.json');

var _getWarningByWarningId = function (warningId) {
    return _.where(_warnings, {warningId: warningId});
};

var _getWarningsByStationId = function (stationId) {
    var filteredWarnings = _.filter(_warnings, function (warning) {
        return warning.stationId === stationId && warning.cleared !== "true";
    });
    return filteredWarnings;
};

var _addWarning = function (warning) {
    warning.warningId = utils.getNewGuid();
    warning.reportedDate = new Date().getTime().toString();
    var warningData = _.extend({}, warning);
    _warnings.push(warningData);
    return warning;
};

var _confirmWarning = function (warningAttributes) {
    var match = _.find(_warnings, function (warning) {
        return warning.warningId === warningAttributes.warningId.toString();
    });

    if (match) {
        match.confirmedBy = warningAttributes.confirmedBy;
        match.confirmedDate = new Date().getTime().toString();
    }

    return _.extend({}, match);
};

var _clearWarning = function (warningAttributes) {
    var match = _.find(_warnings, function (warning) {
        return warning.warningId === warningAttributes.warningId.toString();
    });

    if (match) {
        match.cleared = "true";
    }

    return _.extend({}, match);
};

var WarningRepository = function (options) {
    this.initialize.apply(this, arguments);
};

_.extend(WarningRepository.prototype, {

    initialize: function (options) {
    },

    getWarning: function (options) {
        options || (options = {});
        var deferred = $.Deferred();

        var error;
        var warnings = _getWarningByWarningId(options.warningId.toString());

        var results = {
            warnings: warnings
        };

        window.setTimeout(function () {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(results);
            }
        }, 5);

        return deferred.promise();
    },

    getWarnings: function (options) {
        options || (options = {});
        var deferred = $.Deferred();

        var error;
        var warnings = _getWarningsByStationId(options.stationId.toString());

        var results = {
            warnings: warnings
        };

        window.setTimeout(function () {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(results);
            }
        }, 5);

        return deferred.promise();
    },

    addWarning: function (options) {
        options || (options = {});
        var deferred = $.Deferred();

        var error;
        var warning = _addWarning(options);

        var results = {
            warning: warning
        };

        window.setTimeout(function () {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(results);
            }
        }, 5);

        return deferred.promise();
    },

    confirmWarning: function (options) {
        options || (options = {});
        var deferred = $.Deferred();

        var error;
        var warning = _confirmWarning(options);

        var results = {
            warning: warning
        };

        window.setTimeout(function () {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(results);
            }
        }, 5);

        return deferred.promise();
    },

    clearWarning: function (options) {
        options || (options = {});
        var deferred = $.Deferred();

        var error;
        var warning = _clearWarning(options);

        var results = {
            warning: warning
        };

        window.setTimeout(function () {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(results);
            }
        }, 5);

        return deferred.promise();
    }

});

module.exports = WarningRepository;