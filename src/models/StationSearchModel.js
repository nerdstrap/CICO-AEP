'use strict';
define(function(require) {
    var Backbone = require('backbone'),
            BackboneLocalStorage = require('backbone-localstorage'),
            SearchMethodsEnum = require('enums/SearchMethodsEnum'),
            StationCollection = require('collections/StationCollection'),
            CICOLocationModel = require('models/CICOLocationModel'),
            env = require('env');


    var StationSearchModel = Backbone.Model.extend({
        localStorage: new BackboneLocalStorage('StationSearchModel'),
        initialize: function(options) {
            options || (options = {});
            this.set('id', options.id || 1);
            this.gpsStationCollection = options.gpsStationCollection || new StationCollection();
            this.manualStationCollection = options.manualStationCollection || new StationCollection();
            this.recentStationCollection = options.recentStationCollection || new StationCollection();
            this.locationModel = CICOLocationModel.getInstance();
            this.set('searchMethod', SearchMethodsEnum.gps);
            this.results = new Backbone.Collection();
        },
        getStationsByName: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/station/find'
            });
        },
        getStationsByGps: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/station/find/nearby'
            });
        },
        getRecentStations: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/station/find/recent'
            });
        },
        performGpsStationSearch: function(successCallback, errorCallback, filterStationTypes) {
            var currentContext = this,
                    wrappedSuccessCallback = this.wrapSearchSuccessCallback(successCallback, SearchMethodsEnum.gps),
                    wrappedErrorCallback = this.wrapSearchErrorCallback(errorCallback, SearchMethodsEnum.gps);
            if (this.locationModel.getGeolocationEnabled()) {
                this.locationModel.getCurrentPosition(
                        function(position) {
                            if (position) {
                                $.when(currentContext.getStationsByGps({
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude,
                                    includeDol: true,
                                    includeNoc: true
                                })).done(function(getStationsResponse) {
                                    currentContext.gpsStationCollection.reset(getStationsResponse.stations);
                                    wrappedSuccessCallback(currentContext.gpsStationCollection.models);
                                }).fail(function() {
                                    currentContext.gpsStationCollection.reset();
                                    wrappedErrorCallback();
                                });
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
            this.setPrevFilterStationTypes(filterStationTypes);
        },
        performManualStationSearchWithGps: function(searchQuery, successCallback, errorCallback, gpsErrorCallback, filterStationTypes) {
            var currentContext = this;
            if (!searchQuery) {
                return;
            }
            if (this.locationModel.getGeolocationEnabled()) {
                this.locationModel.getCurrentPosition(
                        function(position) {
                            if (position) {
                                currentContext.performManualStationSearch(searchQuery, successCallback, errorCallback, position, filterStationTypes);
                            }
                            else {
                                gpsErrorCallback('Unable to get current location.');
                                currentContext.performManualStationSearch(searchQuery, successCallback, errorCallback, filterStationTypes);
                            }
                        },
                        function(positionError) {
                            gpsErrorCallback(typeof (positionError) === "string" ? positionError : positionError.message);
                            currentContext.performManualStationSearch(searchQuery, successCallback, errorCallback, filterStationTypes);
                        }
                );
            } else {
                gpsErrorCallback('GeoLocation not supported.');
                currentContext.performManualStationSearch(searchQuery, successCallback, errorCallback, filterStationTypes);
            }
            this.setPrevFilterStationTypes(filterStationTypes);
        },
        performManualStationSearch: function(searchQuery, successCallback, errorCallback, currentPosition, filterStationTypes) {
            if (!searchQuery) {
                return;
            }

            var currentContext = this,
                    wrappedSuccessCallback = this.wrapSearchSuccessCallback(successCallback, SearchMethodsEnum.manual),
                    wrappedErrorCallback = this.wrapSearchErrorCallback(errorCallback, SearchMethodsEnum.manual);
            var onManualFetchSuccess = function() {
                var models = currentContext.results.models;
                if (currentContext.manualStationCollection.length > 0) {
                    var currentSearchQuery = currentContext.get('searchQuery');
                    if (currentSearchQuery) {
                        models = currentContext.manualStationCollection.filter(function(x) {
                            return x.get('stationName').toLowerCase().substr(0, currentSearchQuery.length) === currentSearchQuery.toLowerCase();
                        });
                    } else {
                        models = currentContext.manualStationCollection.models;
                    }
                    if (currentPosition) {
                        $.each(models, function(ndx, station) {
                            if (station.get('hasCoordinates')) {
                                var distanceInMiles = currentContext.locationModel.calculateDistanceFromCurrentPosition(currentPosition.coords, station.get('coords'));
                                station.set('distanceInMiles', distanceInMiles);
                            }
                        });
                    }
                }

                wrappedSuccessCallback(models);
            };

            if (searchQuery.length > 1) {
                if (searchQuery.length >= 2) {
                    var oldSearchQuery = this.get('searchQuery');
                    this.set('searchQuery', searchQuery);
                    var searchQueryPrefix = searchQuery.substr(0, 2);
                    if (!oldSearchQuery || searchQueryPrefix !== oldSearchQuery.substr(0, 2)) {
                        this.set('searchMethod', SearchMethodsEnum.manual);
                        $.when(currentContext.getStationsByName({
                            stationName: searchQueryPrefix,
                            includeDol: true,
                            includeNoc: true
                        })).done(function(getStationsResponse) {
                            currentContext.manualStationCollection.reset(getStationsResponse.stations);
                            onManualFetchSuccess();
                        }).fail(function() {
                            currentContext.manualStationCollection.reset();
                            wrappedErrorCallback();
                        });
                    } else {
                        onManualFetchSuccess();
                    }
                }
            }
            this.setPrevFilterStationTypes(filterStationTypes);
        },
        performRecentStationSearchWithGps: function(successCallback, errorCallback, gpsErrorCallback, filterStationTypes) {
            var currentContext = this;
            if (this.locationModel.getGeolocationEnabled()) {
                this.locationModel.getCurrentPosition(
                        function(position) {
                            if (position) {
                                currentContext.performRecentStationSearch(successCallback, errorCallback, position, filterStationTypes);
                            }
                            else {
                                gpsErrorCallback('Unable to get current location.');
                                currentContext.performRecentStationSearch(successCallback, errorCallback, filterStationTypes);
                            }
                        },
                        function(positionError) {
                            gpsErrorCallback(typeof (positionError) === "string" ? positionError : positionError.message);
                            currentContext.performRecentStationSearch(successCallback, errorCallback, filterStationTypes);
                        }
                );
            } else {
                gpsErrorCallback('GeoLocation not supported.');
                currentContext.performRecentStationSearch(successCallback, errorCallback, filterStationTypes);
            }
            this.setPrevFilterStationTypes(filterStationTypes);
        },
        performRecentStationSearch: function(successCallback, errorCallback, currentPosition, filterStationTypes) {
            var currentContext = this,
                    wrappedSuccessCallback = this.wrapSearchSuccessCallback(successCallback, SearchMethodsEnum.recent),
                    wrappedErrorCallback = this.wrapSearchErrorCallback(errorCallback, SearchMethodsEnum.recent);

            var onRecentFetchSuccess = function() {
                var models = currentContext.results.models;
                if (currentContext.recentStationCollection.length > 0) {
                    models = currentContext.recentStationCollection.models;
                    if (currentPosition) {
                        $.each(models, function(ndx, station) {
                            if (station.get('hasCoordinates')) {
                                var distanceInMiles = currentContext.locationModel.calculateDistanceFromCurrentPosition(currentPosition.coords, station.get('coords'));
                                station.set('distanceInMiles', distanceInMiles);
                            }
                        });
                    }
                } else {
                    models = [];
                }

                wrappedSuccessCallback(models);
            };

            this.set('searchMethod', SearchMethodsEnum.recent);
            $.when(currentContext.getRecentStations({
                resultCount: 5,
                includeDol: true,
                includeNoc: true
            })).done(function(getStationsResponse) {
                currentContext.recentStationCollection.reset(getStationsResponse.stations);
                onRecentFetchSuccess();
            }).fail(function() {
                currentContext.recentStationCollection.reset();
                wrappedErrorCallback();
            });
            this.setPrevFilterStationTypes(filterStationTypes);
        },
        resetStationSearchResults: function(searchMethod) {
            this.results.reset();
            this.set('searchMethod', searchMethod);
            this.unset('searchQuery');
        },
        setPrevFilterStationTypes: function(filterStationTypes) {
            this.set('prevFilterStationTypes', filterStationTypes);
        },
        wrapSearchSuccessCallback: function(successCallback, searchMethod) {
            var currentContext = this;
            return function(responseModels) {
                if (currentContext.get('searchMethod') === searchMethod) {
                    currentContext.results.reset(responseModels);
                    successCallback(currentContext.results);
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
    return StationSearchModel;
});

