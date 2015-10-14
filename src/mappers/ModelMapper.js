'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var CheckInStatusEnum = require('enums/CheckInStatusEnum');
var utils = require('lib/utils');
var config = require('lib/config');

var ModelMapper = function (options) {
    this.initialize.apply(this, arguments);
};

_.extend(ModelMapper.prototype, {

    initialize: function (options) {
        options || (options = {});
    },

    mapStations: function (serviceEntities) {
        var self = this;
        var models;
        if (serviceEntities) {
            models = [];
            for (var i = 0; i < serviceEntities.length; i++) {
                models.push(self.mapStation(serviceEntities[i]));
            }
        }
        return models;
    },

    mapStation: function (serviceEntity) {
        var model;
        if (serviceEntity) {
            model = {};
            for (var attribute in serviceEntity) {
                if (serviceEntity.hasOwnProperty(attribute)) {
                    if (attribute === 'stationId'
                        || attribute === 'stationType'
                        || attribute === 'linkedStationId'
                        || attribute === 'latitude'
                        || attribute === 'longitude'
                        || attribute === 'distance'
                        || attribute === 'transmissionDispatchCenterId'
                        || attribute === 'distributionDispatchCenterId') {
                        if (isNaN(serviceEntity[attribute]) === false) {
                            model[attribute] = Number(serviceEntity[attribute]);
                        } else {
                            model[attribute] = serviceEntity[attribute];
                        }
                    } else if (attribute === 'phone'
                        || attribute === 'transmissionDispatchCenterPhone'
                        || attribute === 'distributionDispatchCenterPhone') {
                        model[attribute] = utils.cleanPhone(serviceEntity[attribute]);
                    } else if (attribute === 'hasHazard'
                        || attribute === 'hasOpenCheckIns'
                        || attribute === 'hasAbnormalConditions'
                        || attribute === 'hasWarnings') {
                        model[attribute] = serviceEntity[attribute] === 'true';
                    } else {
                        model[attribute] = serviceEntity[attribute];
                    }
                }
            }
        }
        return model;
    },


    mapPersonnels: function (serviceEntities) {
        var self = this;
        var models;
        if (serviceEntities) {
            models = [];
            for (var i = 0; i < serviceEntities.length; i++) {
                models.push(self.mapPersonnel(serviceEntities[i]));
            }
        }
        return models;
    },

    mapPersonnel: function (serviceEntity) {
        var model;
        if (serviceEntity) {
            model = {};
            for (var attribute in serviceEntity) {
                if (serviceEntity.hasOwnProperty(attribute)) {
                    if (attribute === 'personnelType') {
                        if (isNaN(serviceEntity[attribute]) === false) {
                            model[attribute] = Number(serviceEntity[attribute]);
                        }
                    } else if (attribute === 'contactNumber') {
                        model[attribute] = utils.cleanPhone(serviceEntity[attribute]);
                    } else {
                        model[attribute] = serviceEntity[attribute];
                    }
                }
            }
        }
        return model;
    },

    mapStationEntryLogs: function (serviceEntities) {
        var self = this;
        var models;
        if (serviceEntities) {
            models = [];
            for (var i = 0; i < serviceEntities.length; i++) {
                models.push(self.mapStationEntryLog(serviceEntities[i]));
            }
        }
        return models;
    },

    mapStationEntryLog: function (serviceEntity) {
        var model;
        if (serviceEntity) {
            model = {};
            for (var attribute in serviceEntity) {
                if (serviceEntity.hasOwnProperty(attribute)) {
                    if (attribute === 'stationEntryLogId'
                        || attribute === 'checkInType'
                        || attribute === 'stationId'
                        || attribute === 'stationType'
                        || attribute === 'personnelType'
                        || attribute === 'latitude'
                        || attribute === 'longitude'
                        || attribute === 'distance'
                        || attribute === 'duration'
                        || attribute === 'dispatchCenterId') {
                        if (isNaN(serviceEntity[attribute]) === false) {
                            model[attribute] = Number(serviceEntity[attribute]);
                        } else {
                            model[attribute] = serviceEntity[attribute];
                        }
                    } else if (attribute === 'contactNumber') {
                        model[attribute] = utils.cleanPhone(serviceEntity[attribute]);
                    } else if (attribute === 'withCrew') {
                        model[attribute] = serviceEntity[attribute] === 'true';
                    } else if (attribute === 'inTime'
                        || attribute === 'outTime') {
                        model[attribute] = new Date(Number(serviceEntity[attribute]));
                    } else {
                        model[attribute] = serviceEntity[attribute];
                    }
                }
            }
        }
        this.afterMapStationEntryLog(model);
        return model;
    },

    afterMapStationEntryLog: function (model) {
        if (model) {
            if (model.inTime && model.duration) {
                model.expectedOutTime = utils.addMinutes(model.inTime, model.duration);
                model.checkInStatus = CheckInStatusEnum.checkedIn;

                if (model.outTime) {
                    model.actualDuration = (model.outTime - model.inTime);
                    model.checkInStatus = CheckInStatusEnum.checkedOut;
                } else {
                    var expectedOutTimeElapsed = new Date() - model.expectedOutTime;
                    if (expectedOutTimeElapsed >= config.thresholds.checkInExpiration) {
                        model.checkInStatus = CheckInStatusEnum.overdue;
                    } else if (expectedOutTimeElapsed > 0) {
                        model.checkInStatus = CheckInStatusEnum.expired;
                    }
                }
            }
        }
    },


    mapAbnormalConditions: function (serviceEntities) {
        var self = this;
        var models;
        if (serviceEntities) {
            models = [];
            for (var i = 0; i < serviceEntities.length; i++) {
                models.push(self.mapAbnormalCondition(serviceEntities[i]));
            }
        }
        return models;
    },

    mapAbnormalCondition: function (serviceEntity) {
        var model;
        if (serviceEntity) {
            model = {};
            for (var attribute in serviceEntity) {
                if (serviceEntity.hasOwnProperty(attribute)) {
                    if (attribute === 'abnormalConditionId'
                        || attribute === 'stationId') {
                        if (isNaN(serviceEntity[attribute]) === false) {
                            model[attribute] = Number(serviceEntity[attribute]);
                        }
                    } else if (attribute === 'hasOutage') {
                        model[attribute] = serviceEntity[attribute] === 'true';
                    } else if (attribute === 'startTime') {
                        model[attribute] = new Date(Number(serviceEntity[attribute]));
                    } else {
                        model[attribute] = serviceEntity[attribute];
                    }
                }
            }
        }
        return model;
    },

    mapWarnings: function (serviceEntities) {
        var self = this;
        var models;
        if (serviceEntities) {
            models = [];
            for (var i = 0; i < serviceEntities.length; i++) {
                models.push(self.mapWarning(serviceEntities[i]));
            }
        }
        return models;
    },

    mapWarning: function (serviceEntity) {
        var model;
        if (serviceEntity) {
            model = {};
            for (var attribute in serviceEntity) {
                if (serviceEntity.hasOwnProperty(attribute)) {
                    if (attribute === 'warningId') {
                        if (isNaN(serviceEntity[attribute]) === false) {
                            model[attribute] = Number(serviceEntity[attribute]);
                        }
                    } else {
                        model[attribute] = serviceEntity[attribute];
                    }
                }
            }
        }
        return model;
    },

    mapOptions: function (serviceEntities) {
        var self = this;
        var models;
        if (serviceEntities) {
            models = [];
            for (var i = 0; i < serviceEntities.length; i++) {
                models.push(self.mapOption(serviceEntities[i]));
            }
        }
        return models;
    },

    mapOption: function (serviceEntity) {
        var model;
        if (serviceEntity) {
            model = {};
            for (var attribute in serviceEntity) {
                if (serviceEntity.hasOwnProperty(attribute)) {
                    model[attribute] = serviceEntity[attribute];
                }
            }
        }
        return model;
    },

    mapSettings: function (serviceEntity) {
        var model;
        if (serviceEntity) {
            model = {};
            for (var attribute in serviceEntity) {
                if (serviceEntity.hasOwnProperty(attribute)) {
                    if (attribute === 'expirationThreshold'
                        || attribute === 'distanceThreshold'
                        || attribute === 'searchResultsThreshold') {
                        if (isNaN(serviceEntity[attribute]) === false) {
                            model[attribute] = Number(serviceEntity[attribute]);
                        }
                    } else {
                        model[attribute] = serviceEntity[attribute];
                    }
                }
            }
        }
        return model;
    }

});

module.exports = ModelMapper;