define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var utils = require('utils');
    var config = require('config');

    var _personnels = [
        {
            "personnelId": "s251201",
            "userName": "Baltic, Michael E",
            "firstName": "Michael",
            "middleName": "E",
            "lastName": "Baltic",
            "contactNumber": "6143239560",
            "email": "mebaltic@aep.com",
            "userRole": "TD|TC"
        }
    ];

    var _clone = function (collection) {
        var clonedCollection = [];
        _.each(collection, function (item) {
            clonedCollection.push(_.clone(item));
        });
        return clonedCollection;
    };

    var _getPersonnelByPersonnelId = function (personnelId) {
        return _clone(_.where(_personnels, {personnelId: personnelId}));
    };

    var _getPersonnelsByUserName = function (userName) {
        var filteredStations = _.filter(_personnels, function (_personnel) {
            return _personnel.userName.toLowerCase().indexOf(userName.toLowerCase()) >= 0;
        });
        return _clone(filteredStations);
    };

    var PersonnelRepository = function (options) {
        this.initialize.apply(this, arguments);
    };

    _.extend(PersonnelRepository.prototype, {

        initialize: function (options) {
        },

        getPersonnelByPersonnelId: function (options) {
            options || (options = {});
            var deferred = $.Deferred();

            var error;
            var myPersonnelId = config.myPersonnelId();
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

        getPersonnelByUserName: function (options) {
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
        },

        getMyPersonnel: function (options) {
            options || (options = {});
            var deferred = $.Deferred();

            var error;
            var myPersonnelId = config.myPersonnelId();
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

        getPersonnelsByUserName: function (options) {
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

    return PersonnelRepository;
});