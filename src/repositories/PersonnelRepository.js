'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var utils = require('lib/utils');
var config = require('lib/config');
var _personnels = require('repositories/personnels');

var _getPersonnelByPersonnelId = function (personnelId) {
    return _.where(_personnels, {personnelId: personnelId});
};

var _getPersonnelsByUserName = function (userName) {
    var filteredStations = _.filter(_personnels, function (_personnel) {
        return _personnel.userName.toLowerCase().indexOf(userName.toLowerCase()) >= 0;
    });
    return filteredStations;
};

var PersonnelRepository = function (options) {
    this.initialize.apply(this, arguments);
};

_.extend(PersonnelRepository.prototype, {

    initialize: function (options) {
    },

    getPersonnel: function (options) {
        options || (options = {});
        var deferred = $.Deferred();

        var error;
        var personnels = _getPersonnelByPersonnelId(options.personnelId);

        var results = {
            personnels: personnels
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

    getMyPersonnel: function () {
        var deferred = $.Deferred();

        var error;
        var myPersonnelId = config.myIdentity.personnelId;
        var personnels = _getPersonnelByPersonnelId(myPersonnelId);

        var results = {
            personnels: personnels
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

    getPersonnels: function (options) {
        options || (options = {});
        var deferred = $.Deferred();

        var error;
        var personnels = _getPersonnelsByUserName(options.userName);

        var results = {
            personnels: personnels
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

module.exports = PersonnelRepository;