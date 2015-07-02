define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            ShellController = require('controllers/base/ShellController'),
            SearchMethodsEnum = require('enums/SearchMethodsEnum'),
            env = require('env'),
            globals = require('globals'),
            StationEntryLogCollection = require('collections/StationEntryCollection'),
            AbnormalConditionCollection = require('collections/AbnormalConditionCollection'),
            StationWarningCollection = require('collections/StationWarningCollection'),
            StationSearchModel = require('models/StationSearchModel'),
            StationEntryLogModel = require('models/StationEntryModel'),
            StationSearchView = require('views/StationSearchView'),
            StationView = require('views/StationView'),
            AdHocStationEntryModel = require('models/StationEntryModel'),
            StationModel = require('models/StationModel'),
            OpenStationEntryLogModel = require('models/StationEntryOpenModel'),
            AdHocLandingView = require('views/AdHocLandingView'),
            CheckInView = require('views/CheckInView'),
            AdHocCheckInView = require('views/AdHocCheckInView'),
            CheckInTypeEnum = require('enums/CheckInTypeEnum'),
            cicoEvents = require('cico-events');
    /**
     * Creates a new StationController with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var StationController = function(options) {
        ShellController.apply(this, [options]);
    };

    _.extend(StationController.prototype, ShellController.prototype, {
        /** @class StationController
         * @contructs StationController object
         * @param {object} options
         */
        initialize: function(options) {
            console.debug('StationController.initialize');
            options || (options = {});
            this.myPersonnelModel = options.myPersonnelModel;
            this.settingsModel = options.settingsModel;
            this.stationSearchModel = new StationSearchModel();
            this.openStationEntryCollection = new StationEntryLogCollection();
            this.dispatcher = options.dispatcher || cicoEvents;

            this.listenTo(this.titleBarView, 'brandTitleButtonClick', this.goToStationList);
            this.listenTo(this.titleBarView, 'goToStationSearch', this.goToStationList);
            this.listenTo(this.titleBarView, 'goToOpenCheckIn', this.goToStationWithOpenEntry);
            this.listenTo(this.titleBarView, 'goToAdHocLanding', this.goToAdHocLanding);
            this.listenTo(this.dispatcher, cicoEvents.goToStationWithId, this.goToStationWithId);
            this.listenTo(this.dispatcher, cicoEvents.checkIntoStation, this.checkIntoStation);
            this.listenTo(this.dispatcher, cicoEvents.goToAdHocCheckIn, this.goToAdHocCheckIn);
            this.listenTo(this.dispatcher, cicoEvents.goToAdHocLanding, this.goToAdHocLanding);
            this.listenTo(this.dispatcher, cicoEvents.goToOpenCheckIn, this.goToStationWithOpenEntry);
            this.listenTo(cicoEvents, cicoEvents.goToOpenCheckIn, this.goToStationWithOpenEntry);
            this.listenTo(cicoEvents, cicoEvents.adhocCheckInSuccess, this.goToStationWithOpenEntry);
            this.listenTo(cicoEvents, cicoEvents.addWarning, this.addStationWarning);
            this.listenTo(cicoEvents, cicoEvents.clearWarning, this.clearStationWarning);
            
            this.listenTo(cicoEvents, cicoEvents.goToCheckIn, this.goToCheckIn);
            this.listenTo(cicoEvents, cicoEvents.goToExtendDuration, this.goToExtendDuration);
            this.listenTo(cicoEvents, cicoEvents.gotToCheckOut, this.goToCheckOut);

            _.bindAll(this, 'updateOpenCheckinMenu', 'checkDurationExpired', 'checkDurationExpiredEveryMinute');
        },
        /** Shows the station search view 
         */
        goToStationList: function() {
            var currentContext = this,
                    deferred = $.Deferred();

            currentContext.setTitleBarOptions();

            var stationSearchViewInstance = new StationSearchView({
                model: currentContext.stationSearchModel,
                myPersonnelModel: currentContext.myPersonnelModel
            });

            stationSearchViewInstance.listenTo(stationSearchViewInstance, "goToStationWithId", function(stationId) {
                currentContext.goToStationWithId(stationId);
            });
            stationSearchViewInstance.listenTo(stationSearchViewInstance, "goToDirections", function(station) {
                currentContext.goToDirections(station);
            });
            stationSearchViewInstance.listenTo(stationSearchViewInstance, "goToAdHocCheckIn", function() {
                currentContext.goToAdHocCheckIn();
            });
            stationSearchViewInstance.listenTo(stationSearchViewInstance, "goToOpenCheckIn", function() {
                currentContext.goToStationWithOpenEntry();
            });

            currentContext.router.swapContent(stationSearchViewInstance);
            stationSearchViewInstance.doSearch();
            var fragmentAlreadyMatches = (Backbone.history.fragment === 'station' || Backbone.history.fragment === '');
            currentContext.router.navigate('station', {replace: fragmentAlreadyMatches});
            deferred.resolve(stationSearchViewInstance);

            return deferred.promise();
        },
        getStations: function(options) {
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
        getOpenStationEntryLogs: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/stationEntryLog/find/open'
            });
        },
        /** Shows the station view
         * @param {object} station
         */
        goToStationWithId: function(stationId) {
            console.debug('StationController.goToStationWithId');
            var currentContext = this;
            var deferred = $.Deferred();

            currentContext.setTitleBarOptions();

            var idRegex = /^\d+$/;
            var stationModel = new StationModel({stationId: stationId});
            var getStationsRequest = {
                'stationId': stationId
            };
            if (idRegex.test(stationId)) {
                stationModel.set({'stationType': 'TD'});
                getStationsRequest.stationType = 'TD';
                getStationsRequest.includeDol = true;
                getStationsRequest.includeNoc = false;
            } else {
                stationModel.set({'stationType': 'TC'});
                getStationsRequest.stationType = 'TC';
                getStationsRequest.includeDol = false;
                getStationsRequest.includeNoc = true;
            }
            var stationEntryCollection = new StationEntryLogCollection();
            var abnormalConditionCollection = new AbnormalConditionCollection();
            var stationWarningCollection = new StationWarningCollection();
            var openStationEntryLogModel = new StationEntryLogModel();
            var stationView = new StationView({
                model: stationModel,
                myPersonnelModel: currentContext.myPersonnelModel,
                settingsModel: currentContext.settingsModel,
                stationEntryCollection: stationEntryCollection,
                openStationEntryLogModel: openStationEntryLogModel,
                abnormalConditionCollection: abnormalConditionCollection,
                stationWarningCollection: stationWarningCollection
            });

            currentContext.stationSearchModel.stationSearch = true;
            currentContext.router.swapContent(stationView);
            currentContext.router.navigate('station/' + stationId);

            $.when(currentContext.getStations(getStationsRequest), currentContext.getOpenStationEntryLogs()).done(function(getStationsResponse, getStationEntryLogsResponse) {
                if (getStationsResponse && getStationsResponse.length > 0) {
                    var getStationsData = getStationsResponse[0];
                    if (getStationsData && getStationsData.stations && getStationsData.stations.length > 0) {
                        stationModel.set(getStationsData.stations[0]);
                        if (getStationEntryLogsResponse && getStationEntryLogsResponse.length > 0) {
                            var getStationEntryLogsData = getStationEntryLogsResponse[0];
                            if (getStationEntryLogsData && getStationEntryLogsData.stationEntryLogs && getStationEntryLogsData.stationEntryLogs.length > 0) {
                                openStationEntryLogModel.set(getStationEntryLogsData.stationEntryLogs[0]);
                            }
                        }
                        stationView.trigger('loaded');
                        deferred.resolve(stationView);
                    }
                }
            }).fail(function() {
                stationModel.clear();
                deferred.reject();
            });

            return deferred.promise();
        },
        goToStationWithOpenEntry: function(stationEntryLogModel) {
            console.debug('StationController.goToStationWithOpenEntry');
            var currentContext = this;

            var stationId = stationEntryLogModel.get('stationId');
            var stationEntryLogId = stationEntryLogModel.get('stationEntryLogId');

            if (stationId) {
                currentContext.goToStationWithId(stationId);
            } else if (stationEntryLogId) {
                currentContext.goToAdHocLanding(stationEntryLogId);
            }
        },
        goToCheckIn: function(stationModel) {
            console.debug('StationController.goToCheckIn');
            var currentContext = this;
            var deferred = $.Deferred();
            var stationEntryModelInstance = new StationEntryLogModel({
                checkInType: CheckInTypeEnum.station,
                stationId: stationModel.get("stationId")
            });
            var stationWarningCollection = new StationWarningCollection();
            var checkInViewInstance = new CheckInView({
                id: 'checkInView',
                model: stationEntryModelInstance,
                controller: currentContext,
                appDataModel: currentContext.appDataModel,
                stationModel: stationModel,
                dispatcher: currentContext.dispatcher,
                stationWarningCollection: stationWarningCollection
            });
            checkInViewInstance.render();
            checkInViewInstance.show();

            deferred.resolve(checkInViewInstance);

            return deferred.promise();
        },
        checkIntoStation: function(stationEntryModel) {
            console.debug('StationController.checkIntoStation');
            var currentContext = this;
            var deferred = $.Deferred();
            var promise = deferred.promise();
            currentContext.progressView.show(promise);

            var stationName;
            var latitude;
            var longitude;

            stationName = stationEntryModel.get('stationName');

            if (stationEntryModel.get('latitude') && stationEntryModel.get('latitude').length > 0) {
                latitude = stationEntryModel.get('latitude');
            }

            if (stationEntryModel.get('longitude') && stationEntryModel.get('longitude').length > 0) {
                longitude = stationEntryModel.get('longitude');
            }

            var checkInRequest = {
                stationId: stationEntryModel.get('stationId'),
                purpose: stationEntryModel.get('purpose'),
                contactNumber: stationEntryModel.get('contactNumber'),
                hasCrew: stationEntryModel.get('hasCrew'),
                duration: stationEntryModel.get('duration'),
                dispatchCenterId: stationEntryModel.get('dispatchCenterId'),
                stationType: stationEntryModel.get('stationType'),
                additionalInfo: stationEntryModel.get('additionalInfo'),
                stationName: stationName,
                description: stationEntryModel.get('description'),
                latitude: latitude,
                longitude: longitude,
                regionName: stationEntryModel.get('regionName'),
                areaName: stationEntryModel.get('areaName')
            };

            $.when(currentContext.postCheckIn(checkInRequest)).done(function(postCheckInResponse) {
                console.debug(postCheckInResponse.stationEntryLog);
                var successModel = new StationEntryLogModel(postCheckInResponse.stationEntryLog);

                currentContext.showConfirmationView('You successfully checked into ' + successModel.get('stationName') + ' until ' + successModel.getExpectedCheckOutTimeString() + '.', 'CheckIn');
                currentContext.appDataModel.set('openStationEntry', successModel);
                currentContext.appDataModel.set({
                    'contactNumber': successModel.get('contactNumber')
                });
                if (successModel.get('stationId')) {
                    cicoEvents.trigger(cicoEvents.checkInSuccess);
                } else {
                    cicoEvents.trigger(cicoEvents.adhocCheckInSuccess);
                }
                deferred.resolve(successModel);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var msg = 'Error checking in. Please call the dispatch center.';
                if (jqXHR.status === 409 && jqXHR.responseText) {
                    msg = jqXHR.responseText;
                }
                //Catch Hazard response.
                if (jqXHR.status === 403 && jqXHR.responseText) {
                    msg = jqXHR.responseText;
                }
                currentContext.showErrorView(msg);
                if (jqXHR.status === 409 || jqXHR.status === 403) {
                    currentContext.goToStationWithId(stationEntryModel.get('stationId'));
                }
                deferred.reject(jqXHR.statusText, jqXHR.responseText);
            });

            return promise;
        },
        extendDuration: function(stationEntryModel, durationModel, additionalInfo) {
            console.debug('StationController.extendDuration');
            var currentContext = this;
            var deferred = $.Deferred();
            var promise = deferred.promise();
            currentContext.progressView.show(promise);

            var latitude;
            var longitude;
            if (!stationEntryModel.get('stationId')) {
                if (stationEntryModel.get('latitude')) {
                    latitude = stationEntryModel.get('latitude');
                }
                if (stationEntryModel.get('longitude')) {
                    longitude = stationEntryModel.get('longitude');
                }
            }
            var duration = durationModel.getNewDuration();
            var additionalMinutes = durationModel.get('additionalMinutes');
            var updateCheckInRequest = {
                stationEntryLogId: stationEntryModel.get('stationEntryLogId'),
                duration: duration,
                stationType: stationEntryModel.get('stationType'),
                additionalInfo: additionalInfo
            };
            $.when(currentContext.postUpdateCheckIn(updateCheckInRequest)).done(function(postUpdateCheckInResponse) {
                var successModel = new StationEntryLogModel(postUpdateCheckInResponse.stationEntryLog);
                if (successModel.get('errorMessage')) {
                    currentContext.showErrorView(successModel.get('errorMessage'));
                    deferred.reject("OK", successModel.get('errorMessage'));
                }
                currentContext.appDataModel.set('openStationEntry', successModel);
                currentContext.appDataModel.attributes.durationExpiredShown = false;
                currentContext.checkDurationExpired();
                if (additionalMinutes === 0) {
                    currentContext.showConfirmationView('You successfully edited your check in.');
                }
                else {
                    currentContext.showConfirmationView('You successfully extended your check in to ' + new Date(successModel.get('inTime')).addMinutes(successModel.get('duration')).cicoDate() + '.', 'CheckIn');
                }
                if (successModel.get('stationId')) {
                    cicoEvents.trigger(cicoEvents.extendDurationSuccess);
                } else {
                    cicoEvents.trigger(cicoEvents.adhocExtendDurationSuccess);
                }
                deferred.resolve(successModel);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var msg = 'Error extending your duration. Please call the dispatch center.';

                //Catch Hazard response.
                if (jqXHR.status === 403 && jqXHR.responseText) {
                    msg = jqXHR.responseText;
                }
                if (jqXHR.status === 409 && jqXHR.responseText) {
                    msg = jqXHR.responseText;
                }
                if (jqXHR.status === 409 || jqXHR.status === 403) {
                    var stationId = stationEntryModel.get('stationId');
                    currentContext.goToStationWithId(stationId);
                }
                console.debug("extend error: " + msg);
                currentContext.showErrorView(msg);
                deferred.reject(jqXHR.statusText, jqXHR.responseText);
            });

            return promise;
        },
        checkOutOfStation: function(stationEntryModel, additionalInfo, stationWarningIds, lastConfirmedBy) {
            console.debug('StationController.checkOutOfStation');
            var currentContext = this;
            var deferred = $.Deferred();
            var promise = deferred.promise();
            currentContext.progressView.show(promise);

            var commonSuccessCallback = function(entry) {
                currentContext.appDataModel.unset('openStationEntry');
                currentContext.appDataModel.attributes.durationExpiredShown = false;
                currentContext.showConfirmationView('You successfully checked out of ' + entry.get('stationName') + ' at ' + new Date(entry.get('outTime')).cicoTime() + '.', 'CheckOut');
                currentContext.stationSearchModel.set({"searchMethod": SearchMethodsEnum.gps});
                currentContext.goToStationList();
                cicoEvents.trigger(cicoEvents.currentCheckedInChange);
                deferred.resolve(entry);
                currentContext.openStationEntryCollection.getOpenStationEntries(
                        function(collection) {
                            if (collection.models.length > 0) {
                                currentContext.appDataModel.set("openStationEntry", collection.models[0]);
                            } else {
                                currentContext.appDataModel.unset("openStationEntry");
                            }
                        }
                );
            };

            var latitude;
            var longitude;

            var checkOutRequest = {};
            var stationEntryModelInstance = new StationEntryLogModel({entryId: stationEntryModel.get('stationEntryLogId')});
            checkOutRequest.stationEntryLogId = stationEntryModel.get('stationEntryLogId');
            checkOutRequest.additionalInfo = additionalInfo;
            checkOutRequest.stationType = stationEntryModel.get('stationType');
            checkOutRequest.stationWarningIds = stationWarningIds;
            checkOutRequest.lastConfirmedBy = lastConfirmedBy;
            stationEntryModelInstance.set({"outTime": new Date().getTime()});
            stationEntryModelInstance.set({"stationType": stationEntryModel.get('stationType')});
            stationEntryModelInstance.set({"additionalInfo": additionalInfo});
            if (!stationEntryModel.get('stationId')) {
                if (stationEntryModel.get('latitude')) {
                    latitude = stationEntryModel.get('latitude');
                    stationEntryModelInstance.set({"latitude": latitude});
                }
                if (stationEntryModel.get('longitude')) {
                    longitude = stationEntryModel.get('longitude');
                    stationEntryModelInstance.set({"longitude": longitude});
                }
            }
            $.when(currentContext.postCheckOut(checkOutRequest)).done(function(postCheckOutResponse) {
                console.debug(postCheckOutResponse.stationEntryLog);
                var successModel = new StationEntryLogModel(postCheckOutResponse.stationEntryLog);
                commonSuccessCallback(successModel);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                // already checked out
//                    if (jqXHR.status === 409) {
//                        model.set(jqXHR.responseJSON.entry);
//                        commonSuccessCallback(model);
//                    } else {
                var msg = 'Error checking out. Please call the dispatch center.';
                //Catch Hazard response.
                if (jqXHR.status === 403 && jqXHR.responseText) {
                    msg = jqXHR.responseText;
                }
                currentContext.showErrorView(msg);
                if (jqXHR.status === 403) {
                    var stationId = stationEntryModel.get('stationId');
                    currentContext.goToStationWithId(stationId);
                }
                deferred.reject(jqXHR.statusText, jqXHR.responseText);
            });

            return promise;
        },
        postCheckIn: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'POST',
                url: env.getApiUrl() + '/stationEntryLog/checkIn'
            });
        },
        postCheckOut: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'PUT',
                url: env.getApiUrl() + '/stationEntryLog/checkOut'
            });
        },
        postUpdateCheckIn: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'PUT',
                url: env.getApiUrl() + '/stationEntryLog/updateCheckIn'
            });
        },
        goToDirections: function(stationModel) {
            if (stationModel.get("hasCoordinates")) {
                var latitude = stationModel.get("latitude");
                var longitude = stationModel.get("longitude");
                this.goToDirectionsLatLon(latitude, longitude);
            } else {
                this.showErrorView("Unable to get directions.  Station is missing coordinates.");
            }
        },
        goToAdhocDirections: function(adhocEntryModel) {
            if (adhocEntryModel.get("latitude") && adhocEntryModel.get("longitude")) {
                var latitude = adhocEntryModel.get("latitude");
                var longitude = adhocEntryModel.get("longitude");
                this.goToDirectionsLatLon(latitude, longitude);
            } else {
                this.showErrorView("Unable to get directions.  Station is missing coordinates.");
            }
        },
        goToExtendDuration: function(currentCheckIn) {
            console.debug('StationController.goToExtendDuration');
            var currentContext = this;
            require(['views/DurationView', 'models/DurationModel'], function(DurationView, DurationModel) {
                var durationModel = new DurationModel({stationEntry: currentCheckIn, durations: currentContext.appDataModel.get("dolDurations")});
                var durationViewInstance = new DurationView({
                    id: '#durationView',
                    model: durationModel,
                    controller: currentContext
                });
                durationViewInstance.render();
                durationViewInstance.show();
            }, function(err) {
                console.debug(err.message);
                currentContext.showErrorView('System not available at this time. Please call the dispatch center if you need assistance.');
            });
        },
//        goToCheckOut: function(currentCheckIn) {
//            console.debug('StationController.goToCheckOut');
//            var currentContext = this;
//            //move require call for check out view and model to the top of the controller
//            //change the check out view render to use the service call $.when method and call getWarnings
//            //on success show confirm warnings and check out
//            require(['views/CheckOutView', 'models/CheckOutModel'], function(CheckOutView, CheckOutModel) {
//                var checkOutModel = new CheckOutModel({stationEntry: currentCheckIn});
//                var checkOutViewInstance = new CheckOutView({
//                    id: '#checkOutView',
//                    model: checkOutModel,
//                    controller: currentContext
//                });
//                checkOutViewInstance.render();
//                checkOutViewInstance.show();
//            }, function(err) {
//                console.debug(err.message);
//                currentContext.showErrorView('System not available at this time. Please call the dispatch center if you need assistance.');
//            });
//        },
        goToCheckOut: function(currentCheckIn) {
            console.debug('StationController.goToCheckOut');
            var currentContext = this;
            //move require call for check out view and model to the top of the controller
            //change the check out view render to use the service call $.when method and call getWarnings
            //on success show confirm warnings and check out
            require(['views/CheckOutView', 'models/CheckOutModel'], function(CheckOutView, CheckOutModel) {
                var checkOutModel = new CheckOutModel({stationEntry: currentCheckIn});
                var stationWarningCollection = new StationWarningCollection();
                var checkOutViewInstance = new CheckOutView({
                    id: '#checkOutView',
                    model: checkOutModel,
                    controller: currentContext,
                    stationWarningCollection: stationWarningCollection
                });

                var getStationWarnings = function() {
                    if (currentCheckIn.get('stationType') === 'TC') {
                        stationWarningCollection.getStationWarningsByStationId(currentCheckIn.get("stationId"));
                    }
                };

                checkOutViewInstance.render();
                checkOutViewInstance.show();
                getStationWarnings();

            }, function(err) {
                console.debug(err.message);
                currentContext.showErrorView('System not available at this time. Please call the dispatch center if you need assistance.');
            });
        },
        /** Check duration expired.
         */
        checkDurationExpired: function() {
            var deferred = $.Deferred();
            var promise = deferred.promise();

            if (this.myPersonnelModel) {
                var openStationEntry = this.myPersonnelModel.get('openStationEntry');
                cicoEvents.trigger('currentCheckedInChange', openStationEntry);
                if (openStationEntry) {
                    var stationId = openStationEntry.get('stationId');
                    var description = openStationEntry.get('description');
                    if ((stationId || description) && openStationEntry.durationExpired() && !openStationEntry.durationExpiredMax()) {
                        if (!this.myPersonnelModel.get('durationExpiredShown')) {
                            this.showWarningView("Your expected check out time has passed. Please check out or extend duration.");
                            this.myPersonnelModel.attributes.durationExpiredShown = true;
                        }
                    } else if ((stationId || description) && openStationEntry.durationExpiredMax()) {
                        if (!openStationEntry.durationExpiredMaxShown) {
                            openStationEntry.durationExpiredMaxShown = true;
                            openStationEntry.trigger('durationExpiredMax');
                        }
                    }
                    deferred.resolve(openStationEntry);
                }
            }

            return promise;
        },
        /** Check duration expired every minute.
         */
        checkDurationExpiredEveryMinute: function() {
            setInterval(this.checkDurationExpired, 60000);
        },
        updateOpenCheckinMenu: function() {
            var currentContext = this;
            if (currentContext.appDataModel) {
                var openStationEntry = currentContext.appDataModel.get('openStationEntry');
                if (openStationEntry) {
                    var stationId = openStationEntry.get('stationId');
                    var description = openStationEntry.get('description');
                    if (stationId || description) {
                        currentContext.checkDurationExpired();
                    }
                }
            }
        },
        _clearLocalStorage: function() {
            if (this.stationSearchModel) {
                this.stationSearchModel._clearLocalStorage();
            }
        },
        goToAdHocCheckIn: function() {
            console.debug('StationController.goToAdHocCheckIn');
            var currentContext = this;
            var deferred = $.Deferred();

            var stationEntryModelInstance = new AdHocStationEntryModel({
                checkInType: CheckInTypeEnum.adHoc
            });
            currentContext.appDataModel.state = 3;
            var adHocCheckInViewInstance = new AdHocCheckInView({
                id: 'adHocCheckInView',
                model: stationEntryModelInstance,
                controller: currentContext,
                appDataModel: currentContext.appDataModel,
                dispatcher: currentContext.dispatcher
            });
            adHocCheckInViewInstance.render();
            adHocCheckInViewInstance.show();
            deferred.resolve(adHocCheckInViewInstance);

            return deferred.promise();
        },
        /**
         * @param {type} adHocStationEntryLogId
         * @returns {StationController}
         */
        goToAdHocLanding: function(adHocStationEntryLogId) {
            console.debug('StationController.goToAdHocLanding');
            var currentContext = this,
                    deferred = $.Deferred();
            currentContext.setTitleBarOptions();

            var adHocEntryLogModelInstance = new AdHocStationEntryModel({entryId: adHocStationEntryLogId});
            var adHocLandingViewInstance = new AdHocLandingView({
                model: adHocEntryLogModelInstance
            });

            adHocLandingViewInstance.listenTo(adHocLandingViewInstance, "goToExtendDuration", function(stationEntry) {
                currentContext.goToExtendDuration(stationEntry);
            });

            adHocLandingViewInstance.listenTo(adHocLandingViewInstance, "goToCheckOut", function(stationEntry) {
                currentContext.goToCheckOut(stationEntry);
            });


            adHocLandingViewInstance.listenTo(cicoEvents, cicoEvents.adhocExtendDurationSuccess, function() {
                adHocLandingViewInstance.model.set(currentContext.appDataModel.get('openStationEntry').toJSON());
                adHocLandingViewInstance.updateViewFromModel();
            });

            adHocLandingViewInstance.listenTo(adHocLandingViewInstance, "goToAdhocDirections", function(adhocEntry) {
                currentContext.goToAdhocDirections(adhocEntry);
            });

            var getStationEntryLog = function(options) {
                options || (options = {});
                var data = $.param(options);

                return $.ajax({
                    contentType: 'application/json',
                    data: data,
                    dataType: 'json',
                    type: 'GET',
                    url: env.getApiUrl() + '/stationEntryLog/find'
                });
            };

            currentContext.router.swapContent(adHocLandingViewInstance);
            currentContext.router.navigate('entry/adhoc/' + adHocStationEntryLogId);

            adHocLandingViewInstance.showLoading();
            $.when(getStationEntryLog({
                'stationEntryLogId': adHocStationEntryLogId,
                'stationType': 'TC',
                'showNoc': true
            })).done(function(getStationEntryLogResponse) {
                if (getStationEntryLogResponse && getStationEntryLogResponse.stationEntryLogs && getStationEntryLogResponse.stationEntryLogs.length > 0) {
                    adHocLandingViewInstance.model.set(getStationEntryLogResponse.stationEntryLogs[0]);
                    adHocLandingViewInstance.updateViewFromModel();
                    adHocLandingViewInstance.hideLoading();
                    currentContext.appDataModel.set("openStationEntry", adHocLandingViewInstance.model);
                    deferred.resolve(adHocLandingViewInstance);
                } else {
                    currentContext.showErrorView('ad hoc entry not found');
                    deferred.reject({
                        adHocLandingView: adHocLandingViewInstance,
                        error: 'ad hoc entry not found'
                    });
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                currentContext.showErrorView(textStatus);
                deferred.reject({
                    adHocLandingView: adHocLandingViewInstance,
                    error: textStatus
                });
            });

            return deferred.promise();
        },
        postAddStationWarning: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'PUT',
                url: env.getApiUrl() + '/station/warning/add'
            });
        },
        postClearStationWarning: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'PUT',
                url: env.getApiUrl() + '/station/warning/clear'
            });
        },
        getStationWarnings: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/station/warning'
            });
        },
        addStationWarning: function(stationWarningModel) {
            console.trace('DashboardController.addStationWarning');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.postAddStationWarning(stationWarningModel.attributes)).done(function(postAddWarningResults) {
                stationWarningModel.set(postAddWarningResults.stationWarning);
                stationWarningModel.trigger(cicoEvents.addWarningSuccess, postAddWarningResults.stationWarning);
                deferred.resolve(postAddWarningResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationWarningModel.trigger(cicoEvents.addWarningError, jqXHR.responseText);
                deferred.reject('error');
            });

            return deferred.promise();
        },
        clearStationWarning: function(stationWarningModel) {
            console.trace('DashboardController.clearStationWarning');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.postClearStationWarning(stationWarningModel.attributes)).done(function(postClearWarningResults) {
                stationWarningModel.set(postClearWarningResults.stationWarning);
                stationWarningModel.trigger(cicoEvents.clearWarningSuccess, postClearWarningResults.stationWarning);
                deferred.resolve(postClearWarningResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationWarningModel.trigger(cicoEvents.clearWarningError, jqXHR.responseText);
                deferred.reject('error');
            });

            return deferred.promise();
        },
        refreshStationWarningList: function(stationWarningCollection, options) {
            console.trace('DashboardController.refreshStationWarningList');
            var currentContext = this,
                    deferred = $.Deferred();

            $.when(currentContext.getStationWarnings(options)).done(function(getStationWarningsResponse) {
                stationWarningCollection.reset(getStationWarningsResponse.stationWarnings);
                deferred.resolve(getStationWarningsResponse);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationWarningCollection.trigger('error');
                deferred.reject(textStatus);
            });

            return deferred.promise();
        }
    });

    return StationController;
});