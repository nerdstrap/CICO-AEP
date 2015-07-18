define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var EventNameEnum = require('enums/EventNameEnum');
    var SearchMethodEnum = require('enums/SearchMethodEnum');
    var StationTypeEnum = require('enums/StationTypeEnum');
    var StationCollection = require('collections/StationCollection');
    var StationCollectionView = require('views/StationCollectionView');
    var template = require('hbs!templates/StationSearchView');

    var StationSearchView = BaseView.extend({

        /**
         *
         * @param {type} options
         * @returns {StationSearchView}
         */
        initialize: function (options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.myPersonnelModel = options.myPersonnelModel;
            this.openStationEntryLogModel = options.openStationEntryLogModel;

            this.keyUpDelay = 200;
            this.searchMethod = SearchMethodEnum.gps;

            this.listenTo(this.dispatcher, EventNameEnum.checkInSuccess, this.onCheckInSuccess);
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
            return this;
        },

        /**
         *
         * @returns {StationSearchView}
         */
        render: function () {
            var currentContext = this;
            currentContext.setElement(template());
            currentContext.renderGpsStationCollectionView();
            currentContext.renderManualStationCollectionView();
            currentContext.renderRecentStationCollectionView();
            return this;
        },

        /**
         *
         * @returns {StationSearchView}
         */
        renderGpsStationCollectionView: function () {
            var currentContext = this;
            currentContext.gpsStationCollection = new StationCollection();
            currentContext.gpsStationCollectionView = new StationCollectionView({
                dispatcher: currentContext.dispatcher,
                myPersonnelModel: currentContext.myPersonnelModel,
                collection: currentContext.gpsStationCollection
            });
            currentContext.renderChildInto(currentContext.gpsStationCollectionView, '#gps-station-collection-view-container');
            return this;
        },

        /**
         *
         * @returns {StationSearchView}
         */
        renderManualStationCollectionView: function () {
            var currentContext = this;
            currentContext.manualStationCollection = new StationCollection();
            currentContext.manualStationCollectionView = new StationCollectionView({
                dispatcher: currentContext.dispatcher,
                myPersonnelModel: currentContext.myPersonnelModel,
                collection: currentContext.manualStationCollection
            });
            currentContext.renderChildInto(currentContext.manualStationCollectionView, '#manual-station-collection-view-container');
            return this;
        },

        /**
         *
         * @returns {StationSearchView}
         */
        renderRecentStationCollectionView: function () {
            var currentContext = this;
            currentContext.recentStationCollection = new StationCollection();
            currentContext.recentStationCollectionView = new StationCollectionView({
                dispatcher: currentContext.dispatcher,
                myPersonnelModel: currentContext.myPersonnelModel,
                collection: currentContext.recentStationCollection
            });
            currentContext.renderChildInto(currentContext.recentStationCollectionView, '#recent-station-collection-view-container');
            return this;
        },

        /**
         *
         */
        events: {
            'click #search-by-gps-button': 'searchByGps',
            'click #search-by-name-button': 'searchByName',
            'click #search-by-recent-button': 'searchByRecent',
            'click #include-dol-input': 'setPrevFilterStationTypes',
            'click #include-noc-input': 'setPrevFilterStationTypes',
            'click #clear-manual-search-input-button': 'clearManualSearchInput',
            'keyup .manual-search-input': 'manualSearchKeyUp',
            'keypress .manual-search-input': 'manualSearchKeyPress',
            'click #go-to-ad-hoc-check-in-button': 'goToAdHocCheckIn'
        },

        /**
         *
         * @returns {StationSearchView}
         */
        updateViewFromModel: function () {
            var currentContext = this;
            if (currentContext.myPersonnelModel && currentContext.myPersonnelModel.has('userRole') && currentContext.myPersonnelModel.get('userRole').indexOf('TC') > 0) {
                currentContext.showStationTypeFilter();
            } else {
                currentContext.hideStationTypeFilter();
            }
            return this;
        },

        /**
         *
         * @param {type} event
         */
        searchByGps: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.searchMethod = SearchMethodEnum.gps;
            currentContext.$('#search-by-gps-button').removeClass('secondary');
            currentContext.$('#search-by-name-button').addClass('secondary');
            currentContext.$('#search-by-recent-button').addClass('secondary');
            currentContext.hideManualSearchInput();
            currentContext.hideAdHocCheckInModalButton();
            currentContext.doSearch();
            return this;
        },

        /**
         *
         * @param {type} event
         */
        searchByName: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.searchMethod = SearchMethodEnum.manual;
            currentContext.$('#search-by-gps-button').addClass('secondary');
            currentContext.$('#search-by-name-button').removeClass('secondary');
            currentContext.$('#search-by-recent-button').addClass('secondary');
            currentContext.showManualSearchInput();
            currentContext.showAdHocCheckInModalButton();
            currentContext.doSearch();
            return this;
        },

        /**
         *
         * @param {type} event
         */
        searchByRecent: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.searchMethod = SearchMethodEnum.recent;
            currentContext.$('#search-by-gps-button').addClass('secondary');
            currentContext.$('#search-by-name-button').addClass('secondary');
            currentContext.$('#search-by-recent-button').removeClass('secondary');
            currentContext.hideManualSearchInput();
            currentContext.hideAdHocCheckInModalButton();
            currentContext.doSearch();
            return this;
        },

        /**
         *
         * @param {type} event
         * @returns {undefined}
         */
        manualSearchKeyUp: function (event) {
            var currentContext = this;
            if (currentContext.manualSearchKeyUp.timeout) {
                window.clearTimeout(currentContext.manualSearchKeyUp.timeout);
            }
            currentContext.manualSearchKeyUp.timeout = window.setTimeout(function () {
                currentContext.doSearch.call(currentContext, event);
            }, currentContext.keyUpDelay);
            currentContext.showClearManualSearchInputButton();
        },

        /**
         *
         * @param {type} event
         */
        manualSearchKeyPress: function (event) {
            if (event) {
                if (event.keyCode === 13) {
                    /* enter key pressed */
                    event.preventDefault();
                }
            }
        },

        /**
         *
         * @returns {StationSearchView}
         */
        clearManualSearchInput: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.$('.manual-search-input').val('');
            currentContext.hideClearManualSearchInputButton();
            return this;
        },

        /**
         *
         * @returns {StationSearchView}
         */
        showManualSearchInput: function () {
            var currentContext = this;
            currentContext.$('#manual-search-input-container').removeClass('hidden');
            return this;
        },

        /**
         *
         * @returns {StationSearchView}
         */
        hideManualSearchInput: function () {
            var currentContext = this;
            currentContext.$('#manual-search-input-container').addClass('hidden');
            return this;
        },

        /**
         *
         * @returns {StationSearchView}
         */
        showClearManualSearchInputButton: function () {
            var currentContext = this;
            currentContext.$('#clear-manual-search-input-button').removeClass('hidden');
            return this;
        },

        /**
         *
         * @returns {StationSearchView}
         */
        hideClearManualSearchInputButton: function () {
            var currentContext = this;
            currentContext.$('#clear-manual-search-input-button').addClass('hidden');
            return this;
        },

        /**
         *
         * @returns {StationSearchView}
         */
        showStationTypeFilter: function () {
            var currentContext = this;
            currentContext.$('#station-type-filter-container').removeClass('hidden');
            return this;
        },

        /**
         *
         * @returns {StationSearchView}
         */
        hideStationTypeFilter: function () {
            var currentContext = this;
            currentContext.$('#station-type-filter-container').addClass('hidden');
            return this;
        },

        /**
         *
         * @returns {StationSearchView}
         */
        showAdHocCheckInModalButton: function () {
            var currentContext = this;
            currentContext.$('#go-to-ad-hoc-check-in-button-container').removeClass('hidden');
            return this;
        },

        /**
         *
         * @returns {StationSearchView}
         */
        hideAdHocCheckInModalButton: function () {
            var currentContext = this;
            currentContext.$('#go-to-ad-hoc-check-in-button-container').addClass('hidden');
            return this;
        },

        /**
         *
         */
        goToAdHocCheckIn: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.dispatcher.trigger(EventNameEnum.goToAdHocCheckIn);
        },

        /**
         *
         * @returns {StationSearchView}
         */
        doSearch: function () {
            var currentContext = this;

            currentContext.$('#gps-station-collection-view-container').addClass('hidden');
            currentContext.$('#manual-station-collection-view-container').addClass('hidden');
            currentContext.$('#recent-station-collection-view-container').addClass('hidden');

            var options = {};

            if (currentContext.searchMethod === SearchMethodEnum.manual) {
                var stationName = currentContext.$('.manual-search-input').val();
                if (stationName.length > 1) {
                    options.stationName = stationName;
                } else {
                    return this;
                }
            }

            if (currentContext.$("#include-dol-input").prop("checked") && currentContext.$("#include-dol-input").prop("checked")) {
                options.includeNoc = true;
                options.includeDol = true;
            } else if (currentContext.$("#include-dol-input").prop("checked")) {
                options.includeDol = true;
            } else if (currentContext.$("#include-noc-input").prop("checked")) {
                options.includeNoc = true;
            }

            if (currentContext.searchMethod === SearchMethodEnum.gps) {
                currentContext.$('#gps-station-collection-view-container').removeClass('hidden');
                currentContext.dispatcher.trigger(EventNameEnum.refreshStationCollectionByGps, currentContext.gpsStationCollection, options);
            } else if (currentContext.searchMethod === SearchMethodEnum.manual) {
                currentContext.$('#manual-station-collection-view-container').removeClass('hidden');
                currentContext.dispatcher.trigger(EventNameEnum.refreshStationCollection, currentContext.manualStationCollection, options);
            } else if (currentContext.searchMethod === SearchMethodEnum.recent) {
                currentContext.$('#recent-station-collection-view-container').removeClass('hidden');
                currentContext.dispatcher.trigger(EventNameEnum.refreshStationCollection, currentContext.recentStationCollection, options);
            }
            return this;
        },

        /**
         *
         */
        onLoaded: function () {
            console.trace('StationSearchView.onLoaded');
            var currentContext = this;
            currentContext.updateViewFromModel();
            this.doSearch();
        },

        /**
         *
         */
        onLeave: function () {
            console.trace('StationSearchView.onLeave');
        }
    });

    return StationSearchView;
});
