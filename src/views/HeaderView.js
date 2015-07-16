define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var EventNameEnum = require('enums/EventNameEnum');
    var template = require('hbs!templates/HeaderView');

    var HeaderView = BaseView.extend({
        /**
         * 
         * @param {type} options
         */
        initialize: function(options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.dispatcher, EventNameEnum.checkInSuccess, this.updateOpenCheckinMenu);
            this.listenTo(this.dispatcher, EventNameEnum.editCheckInSuccess, this.updateOpenCheckinMenu);
            this.listenTo(this.dispatcher, EventNameEnum.checkOutSuccess, this.updateOpenCheckinMenu);
            this.listenTo(this.dispatcher, EventNameEnum.openStationEntryLogReset, this.updateOpenCheckinMenu);
        },
        /**
         * 
         * @returns {HeaderView}
         */
        render: function() {
            var currentContext = this;
            currentContext.setElement(template());
            return this;
        },
        /**
         * 
         */
        events: {
            'click #app-title-button': 'goToStationSearch',
            'click #go-to-station-search-button': 'goToStationSearch',
            'click #go-to-personnel-search-button': 'goToPersonnelSearch',
            'click #go-to-open-check-in-button': 'goToOpenCheckIn'
        },
        /**
         * 
         * @param {type} openStationEntryLogModel
         * @returns {HeaderView}
         */
        updateOpenCheckinMenu: function(openStationEntryLogModel) {
            var currentContext = this;
            currentContext.openStationEntryLogModel = openStationEntryLogModel;
//            if (openStationEntryLogModel && !openStationEntryLogModel.derivedAttributes.checkedOut) {
//                var hasCrew = openStationEntryLogModel.get('hasCrew');
//                var menuButtonSrc = hasCrew ? env.getCheckedInWithCrewButton() : env.getCheckedInButton();
//
//                if (openStationEntryLogModel.durationExpiredMax()) {
//                    menuButtonSrc = hasCrew ? env.getCheckedInWithCrewButtonRestricted() : env.getCheckedInButtonRestricted();
//                }
//                else if (openStationEntryLogModel.durationExpired()) {
//                    menuButtonSrc = hasCrew ? env.getCheckedInWithCrewButtonWarning() : env.getCheckedInButtonWarning();
//                }
//
//                currentContext.setOpenCheckInMenuButtonImage(menuButtonSrc);
//                currentContext.showOpenCheckInMenuMenuButton();
//            }
//            else {
//                this.hideOpenCheckInMenuMenuButton();
//            }
            return this;
        },
        /**
         * 
         * @param {type} event
         */
        goToStationSearch: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.dispatcher.trigger(EventNameEnum.goToStationSearch);
        },
        /**
         * 
         * @param {type} event
         */
        goToPersonnelSearch: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.dispatcher.trigger(EventNameEnum.goToPersonnelSearch);
        },
        /**
         * 
         * @param {type} event
         */
        goToOpenCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var stationId = currentContext.openStationEntryLogModel.get('stationId');
            if (stationId) {
                currentContext.dispatcher.trigger(EventNameEnum.goToStationWithId, stationId);
            } else {
                var stationEntryLogId = currentContext.openStationEntryLogModel.get('stationEntryLogId');
                currentContext.dispatcher.trigger(EventNameEnum.goToAdHocStationWithId, stationEntryLogId);
            }
        },
        /**
         * 
         * @returns {HeaderView}
         */
        showGoToOpenCheckInButton: function() {
            var currentContext = this;
            currentContext.$('#go-to-open-check-in-button-container').removeClass('hidden');
            return this;
        },
        /**
         * 
         * @returns {HeaderView}
         */
        hideGoToOpenCheckInButton: function() {
            var currentContext = this;
            currentContext.$('#go-to-open-check-in-button-container').addClass('hidden');
            return this;
        },
        /**
         * 
         */
        onLoaded: function() {
            console.trace('HeaderView.onLoaded');
        },
        /**
         * 
         */
        onLeave: function() {
            console.trace('HeaderView.onLeave');
        }
    });

    return HeaderView;
});