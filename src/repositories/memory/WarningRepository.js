define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var _warnings = [
        {
            "warningId": "1",
            "stationId": "1",
            "description": "warning one"
        },
        {
            "warningId": "2",
            "stationId": "1",
            "description": "warning two"
        },
        {
            "warningId": "3",
            "stationId": "2",
            "description": "warning three"
        }
    ];

    var _clone = function (collection) {
        var clonedCollection = [];
        _.each(collection, function (item) {
            clonedCollection.push(_.clone(item));
        });
        return clonedCollection;
    };

    var _toString = function (attributes) {
        var stringAttributes = {};
        for (var a in attributes) {
            if (attributes.hasOwnProperty(a)) {
                var attribute = attributes[a];
                if (attribute) {
                    if (a === "expectedOutTime") {
                        stringAttributes[a] = attribute.getMilliseconds().toString();
                    } else {
                        stringAttributes[a] = attribute.toString();
                    }
                }
            }
        }
        return stringAttributes;
    };

    var _getWarningByWarningId = function (warningId) {
        return _clone(_.where(_warnings, {warningId: warningId}));
    };

    var _getWarningsByStationId = function (stationId) {
        var filteredWarnings = _.filter(_warnings, function (warning) {
            return warning.stationId === stationId && warning.cleared !== "true";
        });
        return _clone(filteredWarnings);
    };

    var _addWarning = function (warning) {
        warning.warningId = utils.getNewGuid();
        warning.reportedDate = new Date().getTime();
        var warningData = _toString(warning);
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

        getWarningByWarningId: function (options) {
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

        getWarningsByStationId: function (options) {
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

    return WarningRepository;
});