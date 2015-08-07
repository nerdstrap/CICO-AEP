define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseFormView = require('views/BaseFormView');
    var EventNameEnum = require('enums/EventNameEnum');
    var SearchMethodEnum = require('enums/SearchMethodEnum');
    var PersonnelTypeEnum = require('enums/PersonnelTypeEnum');
    var PersonnelCollection = require('collections/PersonnelCollection');
    var PersonnelCollectionView = require('views/PersonnelCollectionView');
    var template = require('hbs!templates/PersonnelSearchView');

    var PersonnelSearchView = BaseFormView.extend({

        initialize: function (options) {
            BaseFormView.prototype.initialize.apply(this, arguments);
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.myPersonnelModel = options.myPersonnelModel;
            this.myOpenStationEntryLogModel = options.myOpenStationEntryLogModel;

            this.searchMethod = SearchMethodEnum.manual;

            this.listenTo(this.dispatcher, EventNameEnum.checkInSuccess, this.onCheckInSuccess);
            this.listenTo(this, 'loaded', this.onLoaded);
            return this;
        },

        render: function () {
            this.setElement(template(this.renderModel()));
            this.renderGpsPersonnelCollectionView();
            this.renderManualPersonnelCollectionView();
            this.renderRecentPersonnelCollectionView();
            return this;
        },

        renderGpsPersonnelCollectionView: function () {
            this.gpsPersonnelCollection = new PersonnelCollection();
            this.gpsPersonnelCollectionView = new PersonnelCollectionView({
                dispatcher: this.dispatcher,
                myPersonnelModel: this.myPersonnelModel,
                collection: this.gpsPersonnelCollection
            });
            this.renderChildInto(this.gpsPersonnelCollectionView, '#gps-personnel-collection-view-container');
            return this;
        },

        renderManualPersonnelCollectionView: function () {
            this.manualPersonnelCollection = new PersonnelCollection();
            this.manualPersonnelCollectionView = new PersonnelCollectionView({
                dispatcher: this.dispatcher,
                myPersonnelModel: this.myPersonnelModel,
                collection: this.manualPersonnelCollection
            });
            this.renderChildInto(this.manualPersonnelCollectionView, '#manual-personnel-collection-view-container');
            return this;
        },

        renderRecentPersonnelCollectionView: function () {
            this.recentPersonnelCollection = new PersonnelCollection();
            this.recentPersonnelCollectionView = new PersonnelCollectionView({
                dispatcher: this.dispatcher,
                myPersonnelModel: this.myPersonnelModel,
                collection: this.recentPersonnelCollection
            });
            this.renderChildInto(this.recentPersonnelCollectionView, '#recent-personnel-collection-view-container');
            return this;
        },

        events: {
            'click #search-by-gps-button': 'searchByGps',
            'click #search-by-name-button': 'searchByName',
            'click #search-by-recent-button': 'searchByRecent',
            'click #include-dol-input': 'setPrevFilterPersonnelTypes',
            'click #include-noc-input': 'setPrevFilterPersonnelTypes',
            'input [data-input="search"]': 'formSearchInput',
            'click [data-button="clear"]': 'clearFormInput'
        },

        updateViewFromModel: function () {
            var showPersonnelTypeFilter = (this.myPersonnelModel && this.myPersonnelModel.has('userRole') && this.myPersonnelModel.get('userRole').indexOf('TC') > 0);
            this.$('#personnel-type-filter-container').toggleClass('hidden', !showPersonnelTypeFilter);

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

        doSearch: function () {
            this.$('.personnel-collection-card').toggleClass('hidden', true);

            var options = {};

            if (this.searchMethod === SearchMethodEnum.manual) {
                var userName = this.$('#user-name-input').val();
                if (userName.length > 1) {
                    options.userName = userName;
                } else {
                    return this;
                }
            }

            if (this.$('#include-dol-input').prop('checked') && this.$('#include-dol-input').prop('checked')) {
                options.includeNoc = true;
                options.includeDol = true;
            } else if (this.$('#include-dol-input').prop('checked')) {
                options.includeDol = true;
            } else if (this.$('#include-noc-input').prop('checked')) {
                options.includeNoc = true;
            }

            if (this.searchMethod === SearchMethodEnum.gps) {
                this.$('#gps-personnel-collection-view-container').toggleClass('hidden', false);
                this.dispatcher.trigger(EventNameEnum.getPersonnelsByUserNameByGps, this.gpsPersonnelCollection, options);
            } else if (this.searchMethod === SearchMethodEnum.manual) {
                this.$('#manual-personnel-collection-view-container').toggleClass('hidden', false);
                this.dispatcher.trigger(EventNameEnum.getPersonnelsByUserName, this.manualPersonnelCollection, options);
            } else if (this.searchMethod === SearchMethodEnum.recent) {
                options.recent = true;
                this.$('#recent-personnel-collection-view-container').toggleClass('hidden', false);
                this.dispatcher.trigger(EventNameEnum.getPersonnelsByUserName, this.recentPersonnelCollection, options);
            }
            return this;
        },

        onLoaded: function () {
            this.updateViewFromModel();
            this.showLoading();
            this.doSearch();
        }
    });

    return PersonnelSearchView;
});
