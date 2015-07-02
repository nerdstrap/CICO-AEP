define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            ShellController = require('controllers/base/ShellController'),
            env = require('env'),
            globals = require('globals'),
            StationEntryCollection = require('collections/StationEntryCollection'),
            PersonnelSearchModel = require('models/PersonnelSearchModel'),
            PersonnelSearchView = require('views/PersonnelSearchView');
    /**
     * Creates a new PersonnelController with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var PersonnelController = function(options) {
        ShellController.apply(this, [options]);
    };

    _.extend(PersonnelController.prototype, ShellController.prototype, {
        /** @class PersonnelController
         * @contructs PersonnelController object
         * @param {object} options
         */
        initialize: function(options) {
            console.debug('PersonnelController.initialize');
            options || (options = {});
            this.personnelSearchModel = new PersonnelSearchModel();
            this.listenTo(this.titleBarView, 'goToPersonnelSearch', this.goToPersonnelList);
        },
        /** Shows the personnel search view
         */
        goToPersonnelList: function() {
            console.debug('PersonnelController.goToPersonnelList');
            var currentContext = this,
                    deferred = $.Deferred();

            currentContext.setTitleBarOptions();

            var personnelSearchViewInstance = new PersonnelSearchView({
                controller: currentContext,
                model: currentContext.personnelSearchModel
            });
            personnelSearchViewInstance.listenTo(personnelSearchViewInstance, 'goToStationWithId', function(stationId){
                currentContext.router.station(stationId);
            });
            personnelSearchViewInstance.listenTo(personnelSearchViewInstance, 'goToDirections', function(latitude, longitude){
                currentContext.goToDirectionsLatLon(latitude, longitude);
            });
            currentContext.router.swapContent(personnelSearchViewInstance);
            personnelSearchViewInstance.doSearch();
            currentContext.router.navigate('personnel');
            deferred.resolve(personnelSearchViewInstance);

            return deferred.promise();
        },
        /** Shows the personnel view
         * @param {object} personnel
         */
        goToPersonnel: function(personnel) {
            console.debug('PersonnelController.goToPersonnel');
            var currentContext = this,
                    deferred = $.Deferred();
            currentContext.setTitleBarOptions();

            require(['views/PersonnelView'], function(PersonnelView) {
                var stationEntryCollection = new StationEntryCollection();
                var personnelViewInstance = new PersonnelView({
                    model: personnel,
                    appDataModel: currentContext.appDataModel,
                    stationEntryCollection: stationEntryCollection
                });
                stationEntryCollection.getRecentStationEntriesByPersonnel(personnel);

                currentContext.router.swapContent(personnelViewInstance);
                if (personnel.has("outsideId") && personnel.get("outsideId").length > 0) {
                    currentContext.router.navigate('personnel/outsideid/' + encodeURIComponent(personnel.get('outsideId')));
                }
                else {
                    currentContext.router.navigate('personnel/username/' + encodeURIComponent(personnel.get('userName')));
                }
                deferred.resolve(personnelViewInstance);
            }, function(err) {
                console.debug(err.message);
                currentContext.showErrorView('System not available at this time. Please call the dispatch center if you need assistance.');
                deferred.reject();
            });
            return deferred.promise();
        },
        /** Shows the personnel view
         * @param {object} outsideId
         */
        goToPersonnelWithId: function(outsideId) {
            console.debug('PersonnelController.goToPersonnelWithId');
            var currentContext = this;
            require(['models/PersonnelModel'], function(PersonnelModel) {
                var personnelModelInstance = new PersonnelModel({outsideId: outsideId});
                personnelModelInstance.getByOutsideId();
                currentContext.goToPersonnel(personnelModelInstance);
            }, function(err) {
                console.debug(err.message);
                currentContext.showErrorView('System not available at this time. Please call the dispatch center if you need assistance.');
            });
        },
        /** Shows the personnel view
         * @param {string} name
         */
        goToPersonnelWithName: function(name) {
            console.debug('PersonnelController.goToPersonnelWithName');
            var currentContext = this;
            require(['models/PersonnelModel'], function(PersonnelModel) {
                var personnelModelInstance = new PersonnelModel({userName: name});
                personnelModelInstance.getByUsername();
                currentContext.goToPersonnel(personnelModelInstance);
            }, function(err) {
                console.debug(err.message);
                currentContext.showErrorView('System not available at this time. Please call the dispatch center if you need assistance.');
            });
        },
        /** Simple proxy to clear Backbone.localStorage
         */
        _clearLocalStorage: function() {
            if (this.personnelSearchModel) {
                this.personnelSearchModel._clearLocalStorage();
            }
        }
    });

    return PersonnelController;
});