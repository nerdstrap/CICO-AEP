define(function(require) {
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
        initialize: function(options) {
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
        render: function() {
            var currentContext = this;
            currentContext.setElement(template());
            currentContext.renderStationCollectionView();
            return this;
        },
        
        /**
         * 
         * @returns {StationSearchView}
         */
        renderStationCollectionView: function() {
            var currentContext = this;
            currentContext.stationCollection = new StationCollection();
            currentContext.stationCollectionView = new StationCollectionView({
                dispatcher: currentContext.dispatcher,
                myPersonnelModel: currentContext.myPersonnelModel,
                collection: currentContext.stationCollection
            });
            currentContext.renderChildInto(currentContext.stationCollectionView, '#station-collection-view-container');
            return this;
        },
        
        /**
         * 
         */
        events: {
            'click #search-by-gps-button': 'searchByGps',
            'click #search-by-name-button': 'searchByName',
            'click #search-by-recent-button': 'searchByRecent',
            'click #clear-manual-search-input-button': 'clearManualSearch',
            'keyup .manual-search-input': 'manualSearchKeyUp',
            'keypress .manual-search-input': 'manualSearchKeyPress',
            'click #include-dol-input': 'setPrevFilterStationTypes',
            'click #include-noc-input': 'setPrevFilterStationTypes'
        },
        
        /**
         * 
         * @returns {StationSearchView}
         */
        updateViewFromModel: function() {
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
        searchByGps: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.searchMethod = SearchMethodEnum.gps;
            currentContext.$('#search-by-gps-button').removeClass('secondary');
            currentContext.$('#search-by-name-button').addClass('secondary');
            currentContext.$('#search-by-recent-button').addClass('secondary');
            currentContext.clearManualSearchInput();
            currentContext.hideManualSearchInput();
            currentContext.doSearch();
            return this;
        },
        
        /**
         * 
         * @param {type} event
         */
        searchByName: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.searchMethod = SearchMethodEnum.manual;
            currentContext.$('#search-by-gps-button').removeClass('secondary');
            currentContext.$('#search-by-name-button').addClass('secondary');
            currentContext.$('#search-by-recent-button').addClass('secondary');
            currentContext.doSearch();
            return this;
        },
        
        /**
         * 
         * @param {type} event
         */
        searchByRecent: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.searchMethod = SearchMethodEnum.recent;
            currentContext.$('#search-by-gps-button').removeClass('secondary');
            currentContext.$('#search-by-name-button').addClass('secondary');
            currentContext.$('#search-by-recent-button').addClass('secondary');
            currentContext.clearManualSearchInput();
            currentContext.hideManualSearchInput();
            currentContext.doSearch();
            return this;
        },
        
        /**
         * 
         * @param {type} event
         * @returns {undefined}
         */
        manualSearchKeyUp: function(event) {
            var currentContext = this;
            if (this.searchKeyUp.timeout) {
                window.clearTimeout(currentContext.manualSearchKeyUp.timeout);
            }
            currentContext.searchKeyUp.timeout = window.setTimeout(function() {
                currentContext.doSearch.call(currentContext, event);
            }, currentContext.keyUpDelay);
            currentContext.showClearManualSearchInputButton();
        },
        
        /**
         * 
         * @param {type} event
         */
        manualSearchKeyPress: function(event) {
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
        clearManualSearchInput: function() {
            var currentContext = this;
            currentContext.$('.manual-search-input').val('');
            currentContext.hideClearManualSearchInputButton();
            return this;
        },
        
        /**
         * 
         * @returns {StationSearchView}
         */
        showManualSearchInput: function() {
            var currentContext = this;
            currentContext.$('#manual-search-input-container').removeClass('hidden');
            return this;
        },
        
        /**
         * 
         * @returns {StationSearchView}
         */
        hideManualSearchInput: function() {
            var currentContext = this;
            currentContext.$('#manual-search-input-container').addClass('hidden');
            return this;
        },
        
        /**
         * 
         * @returns {StationSearchView}
         */
        showClearManualSearchInputButton: function() {
            var currentContext = this;
            currentContext.$('#clear-manual-search-input-button').removeClass('hidden');
            return this;
        },
        
        /**
         * 
         * @returns {StationSearchView}
         */
        hideClearManualSearchInputButton: function() {
            var currentContext = this;
            currentContext.$('#clear-manual-search-input-button').addClass('hidden');
            return this;
        },
        
        /**
         * 
         * @returns {StationSearchView}
         */
        showStationTypeFilter: function() {
            var currentContext = this;
            currentContext.$('#station-type-filter-container').removeClass('hidden');
            return this;
        },
        
        /**
         * 
         * @returns {StationSearchView}
         */
        hideStationTypeFilter: function() {
            var currentContext = this;
            currentContext.$('#station-type-filter-container').addClass('hidden');
            return this;
        },
        
        /**
         * 
         * @returns {StationSearchView}
         */
        doSearch: function() {
            var currentContext = this;

            var options = {
            };

            if (currentContext.$("#include-dol-input").prop("checked") && currentContext.$("#include-dol-input").prop("checked")) {
                options.includeNoc = true;
                options.includeDol = true;
            } else if (currentContext.$("#include-dol-input").prop("checked")) {
                options.includeDol = true;
            } else if (currentContext.$("#include-noc-input").prop("checked")) {
                options.includeNoc = true;
            }

            if (currentContext.searchMethod === SearchMethodEnum.manual) {
                var stationName = currentContext.$('.manual-search-input').val();
                if (stationName.length > 1) {
                    options.stationName = stationName;
                } else {
                    return this;
                }
            }

            if (currentContext.searchMethod === SearchMethodEnum.gps) {
                currentContext.dispatcher.trigger(EventNameEnum.refreshStationCollectionByGps, currentContext.stationCollection, options);
            } else {
                currentContext.dispatcher.trigger(EventNameEnum.refreshStationCollection, currentContext.stationCollection, options);
            }
            return this;
        },
        
        /**
         * 
         */
        onLoaded: function() {
            console.trace('StationSearchView.onLoaded');
            var currentContext = this;
            currentContext.updateViewFromModel();
            this.doSearch();
        },
        
        /**
         * 
         */
        onLeave: function() {
            console.trace('StationSearchView.onLeave');
        }
    });

    return StationSearchView;
});
