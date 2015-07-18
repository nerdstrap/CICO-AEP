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
            "userRole": "Admin"
        }
    ];

    var _getById = function (personnelId) {
        return _.where(_personnels, {personnelId: personnelId});
    };

    var _getBySearchQuery = function (searchQuery) {
        return _.where(_personnels, {userName: searchQuery});
    };

    var PersonnelRepository = function (options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(PersonnelRepository.prototype, {
        initialize: function (options) {
            options || (options = {});
        },
        getMyPersonnel: function () {
            var currentContext = this;
            var deferred = $.Deferred();

            var myPersonnelId = config.myPersonnelId;
            var personnels = _getById(myPersonnelId);

            var results = {
                personnels: personnels
            };

            window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 20);

            return deferred.promise();
        },
        getPersonnels: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var personnels;
            if (options.personnelId) {
                personnels = _getById(options.personnelId);
            } else if (options.searchQuery && options.searchQuery.length > 1) {
                personnels = _getBySearchQuery(options.searchQuery);
            } else if (options.coords) {
                personnels = [];
            } else {
                personnels = [];
            }

            var results = {
                personnels: personnels
            };

            window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 20);

            return deferred.promise();
        }
    });

    return PersonnelRepository;
});