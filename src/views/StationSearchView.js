'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseFormView = require('views/BaseFormView');
var EventNameEnum = require('enums/EventNameEnum');
var SearchMethodEnum = require('enums/SearchMethodEnum');
var StationCollection = require('collections/StationCollection');
var StationCollectionView = require('views/StationCollectionView');
var template = require('templates/StationSearchView.hbs');

var StationSearchView = BaseFormView.extend({

    initialize: function (options) {
        BaseFormView.prototype.initialize.apply(this, arguments);
        options || (options = {});
        this.dispatcher = options.dispatcher || this;
        this.myPersonnelModel = options.myPersonnelModel;
        this.myOpenStationEntryLogModel = options.myOpenStationEntryLogModel;
        this.searchMethod = SearchMethodEnum.gps;
        this.listenTo(this.dispatcher, EventNameEnum.checkInSuccess, this.onCheckInSuccess);
        this.listenTo(this, 'loaded', this.onLoaded);
        return this;
    },

    render: function () {
        this.setElement(template(this.renderModel()));
        this.renderGpsStationCollectionView();
        this.renderManualStationCollectionView();
        this.renderRecentStationCollectionView();
        return this;
    },

    renderGpsStationCollectionView: function () {
        this.gpsStationCollection = new StationCollection();
        this.gpsStationCollectionView = new StationCollectionView({
            dispatcher: this.dispatcher,
            myPersonnelModel: this.myPersonnelModel,
            collection: this.gpsStationCollection
        });
        this.renderChildInto(this.gpsStationCollectionView, '#gps-station-collection-view-container');
        return this;
    },

    renderManualStationCollectionView: function () {
        this.manualStationCollection = new StationCollection();
        this.manualStationCollectionView = new StationCollectionView({
            dispatcher: this.dispatcher,
            myPersonnelModel: this.myPersonnelModel,
            collection: this.manualStationCollection
        });
        this.renderChildInto(this.manualStationCollectionView, '#manual-station-collection-view-container');
        return this;
    },

    renderRecentStationCollectionView: function () {
        this.recentStationCollection = new StationCollection();
        this.recentStationCollectionView = new StationCollectionView({
            dispatcher: this.dispatcher,
            myPersonnelModel: this.myPersonnelModel,
            collection: this.recentStationCollection
        });
        this.renderChildInto(this.recentStationCollectionView, '#recent-station-collection-view-container');
        return this;
    },

    events: {
        'click #search-by-gps-button': 'searchByGps',
        'click #search-by-name-button': 'searchByName',
        'click #search-by-recent-button': 'searchByRecent',
        'click #include-dol-input': 'setPrevFilterStationTypes',
        'click #include-noc-input': 'setPrevFilterStationTypes',
        'input [data-input="search"]': 'formSearchInput',
        'click [data-button="clear"]': 'clearFormInput',
        'click #go-to-ad-hoc-check-in-button': 'goToAdHocCheckIn',
        'click #go-to-open-check-in-button': 'goToOpenCheckIn'
    },

    updateViewFromModel: function () {
        var showStationTypeFilter = false;
        if (this.myPersonnelModel) {
            var userRole = this.myPersonnelModel.get('userRole');
            if (userRole && userRole.indexOf('TC') > 0) {
                showStationTypeFilter = true;
            }
        }
        this.$('#station-type-filter-container').toggleClass('hidden', !showStationTypeFilter);

        var checkedIn = false;
        if (this.myOpenStationEntryLogModel) {
            var stationEntryLogId = this.myOpenStationEntryLogModel.get('stationEntryLogId');
            if (stationEntryLogId) {
                checkedIn = true;
            }
        }
        this.$('#go-to-ad-hoc-check-in-button').toggleClass('hidden', checkedIn);
        this.$('#go-to-open-check-in-button').toggleClass('hidden', !checkedIn);
        return this;
    },

    searchByGps: function (event) {
        if (event) {
            event.preventDefault();
        }
        this.searchMethod = SearchMethodEnum.gps;
        this.$('#search-by-gps-button').toggleClass('secondary', false);
        this.$('#search-by-name-button').toggleClass('secondary', true);
        this.$('#search-by-recent-button').toggleClass('secondary', true);
        this.$('#manual-search-controls-container').toggleClass('hidden', true);
        this.doSearch();
        return this;
    },

    searchByName: function (event) {
        if (event) {
            event.preventDefault();
        }
        this.searchMethod = SearchMethodEnum.manual;
        this.$('#search-by-gps-button').toggleClass('secondary', true);
        this.$('#search-by-name-button').toggleClass('secondary', false);
        this.$('#search-by-recent-button').toggleClass('secondary', true);
        this.$('#manual-search-controls-container').toggleClass('hidden', false);
        this.doSearch();
        return this;
    },

    searchByRecent: function (event) {
        if (event) {
            event.preventDefault();
        }
        this.searchMethod = SearchMethodEnum.recent;
        this.$('#search-by-gps-button').toggleClass('secondary', true);
        this.$('#search-by-name-button').toggleClass('secondary', true);
        this.$('#search-by-recent-button').toggleClass('secondary', false);
        this.$('#manual-search-controls-container').toggleClass('hidden', true);
        this.doSearch();
        return this;
    },

    goToAdHocCheckIn: function (event) {
        if (event) {
            event.preventDefault();
        }
        this.dispatcher.trigger(EventNameEnum.goToAdHocCheckIn);
    },

    goToOpenCheckIn: function (event) {
        if (event) {
            event.preventDefault();
        }
        var stationId = this.myOpenStationEntryLogModel.get('stationId');
        if (stationId) {
            this.dispatcher.trigger(EventNameEnum.goToStationDetails, stationId);
        } else {
            var stationEntryLogId = this.myOpenStationEntryLogModel.get('stationEntryLogId');
            this.dispatcher.trigger(EventNameEnum.goToAdHocStationDetails, stationEntryLogId);
        }
    },

    doSearch: function () {
        this.$('.station-collection-card').toggleClass('hidden', true);

        var options = {};

        if (this.searchMethod === SearchMethodEnum.manual) {
            var stationName = this.$('#station-name-input').val();
            if (stationName.length > 1) {
                options.stationName = stationName;
            } else {
                return this;
            }
        }

        options.includeDol = this.$('#include-dol-input').prop('checked');
        options.includeNoc = this.$('#include-noc-input').prop('checked');

        if (this.searchMethod === SearchMethodEnum.gps) {
            this.$('#gps-station-collection-view-container').toggleClass('hidden', false);
            this.gpsStationCollection.trigger('sync');
            this.dispatcher.trigger(EventNameEnum.getNearbyStations, this.gpsStationCollection, options);
        } else if (this.searchMethod === SearchMethodEnum.manual) {
            this.manualStationCollection.trigger('sync');
            this.$('#manual-station-collection-view-container').toggleClass('hidden', false);
            this.dispatcher.trigger(EventNameEnum.getStations, this.manualStationCollection, options);
        } else if (this.searchMethod === SearchMethodEnum.recent) {
            this.recentStationCollection.trigger('sync');
            this.$('#recent-station-collection-view-container').toggleClass('hidden', false);
            this.dispatcher.trigger(EventNameEnum.getRecentStations, this.recentStationCollection, options);
        }
        return this;
    },

    onLoaded: function () {
        this.updateViewFromModel();
        this.showLoading();
        this.doSearch();
    }
});

module.exports = StationSearchView;