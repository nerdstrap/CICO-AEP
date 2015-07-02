
define(function(require) {
    'use strict';
    var Backbone = require('backbone'),
            BackboneLocalStorage = require('backbone-localstorage'),
            SearchMethodsEnum = require('enums/SearchMethodsEnum'),
            
            PersonnelCollection = require('collections/PersonnelCollection'),
            StationEntryCollection = require('collections/StationEntryCollection'),
            CICOLocationModel = require('models/CICOLocationModel'),
            env = require('env'),
            globals = require('globals');

    var PersonnelSearchModel = Backbone.Model.extend({
        localStorage: new BackboneLocalStorage('PersonnelSearchModel'),
        initialize: function(options) {
            if (!options) {
                options = {};
            }
            this.set('id', options.id || 1);
            this.gpsStationEntryCollection = options.gpsStationEntryCollection || new StationEntryCollection();
            this.manualPersonnelCollection = options.manualPersonnelCollection || new PersonnelCollection();
            this.locationModel = CICOLocationModel.getInstance();
            this.set('searchMethod', SearchMethodsEnum.manual);
            this.resultsManual = new Backbone.Collection();
            this.resultsGps = new Backbone.Collection();
        },
        getNearbyStationEntryLogs: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/stationEntryLog/find/nearby'
            });
        },
        getPersonnels: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/personnel/find'
            });
        },
        performGpsPersonnelSearch: function(successCallback, errorCallback) {
            var currentContext = this,
                    wrappedSuccessCallback = this.wrapSearchSuccessCallback(successCallback, SearchMethodsEnum.gps),
                    wrappedErrorCallback = this.wrapSearchErrorCallback(errorCallback, SearchMethodsEnum.gps);
            if (this.locationModel.getGeolocationEnabled()) {
                this.locationModel.getCurrentPosition(
                        function(position) {
                            if (position) {
                                $.when(currentContext.getNearbyStationEntryLogs({
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude,
                                    distance: 50,
                                    includeDol: true,
                                    includeNoc: true
                                })).done(function(getStationEntryLogsResponse) {
                                    currentContext.gpsStationEntryCollection.reset(getStationEntryLogsResponse.stationEntryLogs);
                                    wrappedSuccessCallback(currentContext.gpsStationEntryCollection.models);
                                }).fail(function() {
                                    currentContext.gpsStationEntryCollection.reset();
                                    wrappedErrorCallback();
                                });
//                                currentContext.gpsStationEntryCollection.fetch({
//                                    url: '/CheckInCheckOutMobile-services/webresources/cicoStationEntry/nearby',
//                                    reset: true,
//                                    data: $.param({
//                                        lat: position.coords.latitude,
//                                        lng: position.coords.longitude,
//                                        distance: 50
//                                    }),
//                                    success: function(collection, response, options) {
//                                        wrappedSuccessCallback(currentContext.gpsStationEntryCollection.models);
//                                    },
//                                    error: function(collection, response, options) {
//                                        wrappedErrorCallback();
//                                    }
//                                });
                            } else {
                                wrappedErrorCallback('Unable to get current location.');
                            }
                        },
                        function(error) {
                            wrappedErrorCallback(error);
                        }
                );
            } else {
                wrappedErrorCallback('GeoLocation not supported');
            }
        },
        performManualPersonnelSearch: function(searchQuery, successCallback, errorCallback) {
            if (!searchQuery) {
                return;
            }
            var currentContext = this,
                    wrappedSuccessCallback = this.wrapSearchSuccessCallback(successCallback, SearchMethodsEnum.manual),
                    wrappedErrorCallback = this.wrapSearchErrorCallback(errorCallback, SearchMethodsEnum.manual);
            var onManualFetchSuccess = function() {
                var models = currentContext.manualPersonnelCollection.models;
                wrappedSuccessCallback(models);
            };

            if (searchQuery.trim().length > 1) {
                var oldSearchStatus = this.searchStatus;
                if (searchQuery.trim().length >= 2) {
                    var oldSearchQuery = this.get('searchQuery');
                    this.set('searchQuery', searchQuery);
                    var searchQueryPrefix = searchQuery.substr(0, 2);
                    if (!oldSearchQuery || searchQueryPrefix !== oldSearchQuery.substr(0, 2)) {
                        this.set('searchMethod', SearchMethodsEnum.manual);
                        $.when(currentContext.getPersonnels({
                            userName: searchQueryPrefix,
                            includeDol: true,
                            includeNoc: true
                        })).done(function(getPersonnelsResponse) {
                            currentContext.manualPersonnelCollection.reset(getPersonnelsResponse.personnels);
                            wrappedSuccessCallback(currentContext.manualPersonnelCollection.models);
                        }).fail(function() {
                            currentContext.manualPersonnelCollection.reset();
                            wrappedErrorCallback();
                        });
//                        this.manualPersonnelCollection.fetch({
//                            url: '/CheckInCheckOutMobile-services/webresources/personnel/find',
//                            reset: true,
//                            data: {
//                                username: searchQueryPrefix
//                            },
//                            success: onManualFetchSuccess,
//                            error: function(collection, response, options) {
//                                wrappedErrorCallback();
//                            }
//                        });
                    } else {
                        onManualFetchSuccess();
                    }
                }
            }
        },
        resetPersonnelSearchResults: function(searchMethod) {
            if (searchMethod === SearchMethodsEnum.manual) {
                this.resultsManual.reset();
                this.unset("searchQuery");
            }
            else {
                this.resultsGps.reset();
            }
            this.set('searchMethod', searchMethod);
        },
        wrapSearchSuccessCallback: function(successCallback, searchMethod) {
            var currentContext = this;
            return function(responseModels) {
                if (currentContext.get('searchMethod') === searchMethod) {
                    if (searchMethod === SearchMethodsEnum.manual) {
                        currentContext.resultsManual.reset(responseModels);
                    }
                    else {
                        currentContext.resultsGps.reset(responseModels);
                    }
                    successCallback(responseModels);
                }
            };
        },
        wrapSearchErrorCallback: function(errorCallback, searchMethod) {
            var currentContext = this;
            return function(errorMessage) {
                if (currentContext.get('searchMethod') === searchMethod) {
                    errorCallback(errorMessage);
                }
            };
        },
        _clearLocalStorage: function() {
            if (this.localStorage) {
                this.localStorage._clear();
            }
        }
    });
    return PersonnelSearchModel;
});