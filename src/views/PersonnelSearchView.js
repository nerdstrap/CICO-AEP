define(function(require) {

    'use strict';

    var $ = require('jquery'),
            highlight = require('jquery-highlight'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/base/CompositeView'),
            SearchMethodsEnum = require('enums/SearchMethodsEnum'),
            env = require('env'),
            PersonnelListView = require('views/PersonnelListView'),
            NearbyStationEntryListView = require('views/NearbyStationEntryListView'),
            template = require('hbs!templates/PersonnelSearch'),
            cicoEvents = require('cico-events');

    var PersonnelSearchView = CompositeView.extend({
        className: 'search-view personnel-search-view',
        initialize: function(options) {
            console.debug('PersonnelSearchView.initialize');
            options || (options = {});
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;
            this.searchAttributes = {
                manualSearchWatermark: 'enter an employee name...',
                loadingMessage: ' Getting personnel...',
                loadingMessageGps: ' Getting nearby entries...',
                errorMessage: 'System not available at this time. Please call the dispatch center to find an employee.',
                infoMessage: 'No results.'
            };

            this.keyUpDelay = 200;

            _.bindAll(this, 'onFetchSuccess', 'onManualFetchSuccess', 'onFetchError', 'onGpsError');
        },
        render: function() {
            var currentContext = this;
            this.$el.html(template(this.searchAttributes));

            this.gpsSearchBtn = this.$('#gpsSearchBtn');
            this.manualSearchBtn = this.$('#gpsSearchBtn');
            this.clearManualSearch = this.$('#clearManualSearch');
            this.searchListLoadingControl = this.$('.list-view-loading');

            var searchQuery = currentContext.model.get("searchQuery");
            if (searchQuery && searchQuery.length > 0) {
                this.$('.personnel-search-query').val(searchQuery);
            }

            var personnelListView = new PersonnelListView({
                collection: currentContext.model.resultsManual,
                el: $('.manual-personnel-search-list', currentContext.el)
            });
            this.renderChild(personnelListView);

            var nearbyStationEntryListView = new NearbyStationEntryListView({
                collection: currentContext.model.resultsGps,
                el: $('.gps-personnel-search-list', currentContext.el)
            });
            this.renderChild(nearbyStationEntryListView);

            return this;
        },
        events: {
            'click #gpsSearchBtn': 'showGpsSearch',
            'click #manualSearchBtn': 'showManualSearch',
            'click #clearManualSearchBtn': 'clearManualSearch',
            'keyup .personnel-search-query': 'searchKeyUp',
            'keypress .personnel-search-query': 'onKeyPress',
            'click .station-name-text-link': 'selectStationItem',
            'click .personnel-name-text-link': 'selectPersonnelItem',
            'click .directions-text-link': 'goToDirections'
        },
        onKeyPress: function(event) {
            var validPattern = /^[A-Za-z0-9\s]*$/;
            if (event) {
                if (event.keyCode === 13) {
                    /* enter key pressed */
                    event.preventDefault();
                }
                var charCode = event.charCode || event.keyCode || event.which;
                var inputChar = String.fromCharCode(charCode);
                if (!validPattern.test(inputChar) && event.charCode !== 0) {
                    return false;
                    // TODO should this be above the return? or deleted?
                    event.preventDefault();
                }
            }
        },
        showGpsSearch: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.model.resetPersonnelSearchResults(SearchMethodsEnum.gps);
            this.hideIndicators();
            this.hideManualSearchForm();
            this.$('#gpsSearchBtn').removeClass('cico-default');
            this.$('#manualSearchBtn').addClass('cico-default');
            this.$('.manual-personnel-search-list').addClass('hidden');
            this.$('.gps-personnel-search-list').removeClass('hidden');
            this.doGpsSearch();
        },
        showManualSearch: function(event, persistSearchQueryInput) {
            if (event) {
                event.preventDefault();
            }
            this.model.resetPersonnelSearchResults(SearchMethodsEnum.manual);
            this.hideIndicators();
            if (!persistSearchQueryInput) {
                this.resetSearchQueryInput();
            }
            this.showClearSearchButton();
            this.showManualSearchForm();
            this.$('#gpsSearchBtn').addClass('cico-default');
            this.$('#manualSearchBtn').removeClass('cico-default');
            this.$('.gps-personnel-search-list').addClass('hidden');
            this.$('.manual-personnel-search-list').removeClass('hidden');
        },
        clearManualSearch: function(event) {
            if (event) {
                event.preventDefault();
                this.$('.personnel-search-query').focus();
            }
            this.model.resetPersonnelSearchResults(SearchMethodsEnum.manual);
            this.hideIndicators();
            this.resetSearchQueryInput();
        },
        searchKeyUp: function(event) {
            if (this.searchKeyUp.timeout) {
                clearTimeout(this.searchKeyUp.timeout);
            }
            var target = this;
            this.searchKeyUp.timeout = setTimeout(function() {
                target.doManualSearch.call(target, event);
            }, target.keyUpDelay);

            this.showClearSearchButton();
        },
        showClearSearchButton: function(showButton) {
            var show = showButton || (this.$('#manualSearchInput').val().length > 0);
            if (!show) {
                this.$('#clearManualSearchBtn').hide();
            }
            else {
                this.$('#clearManualSearchBtn').show();
            }
        },
        selectStationItem: function(event) {
            if (event) {
                event.preventDefault();
            }
            var stationId = $(event.target).data('stationid');
            var idRegex = /^\d+$/;
            if(idRegex.test(stationId)) {
                cicoEvents.trigger(cicoEvents.goToStationWithId, parseInt(stationId));
            } else {
                cicoEvents.trigger(cicoEvents.goToStationWithId, stationId);                
            }
        },
        selectPersonnelItem: function(event) {
            if (event) {
                event.preventDefault();
            }
            var outsideId = $(event.target).closest('.text-link').data('outsideid');
            if (outsideId) {
                this.controller.goToPersonnelWithId(outsideId);
            }
            else {
                var userName = $(event.target).closest('.text-link').data('username');
                if (userName) {
                    this.controller.goToPersonnelWithName(userName);
                }
            }
        },
        showManualSearchForm: function() {
            this.$('.manual-search-form').removeClass('hidden');
        },
        hideManualSearchForm: function() {
            this.$('.manual-search-form').addClass('hidden');
        },
        showLoading: function(message) {
            if (message) {
                this.$('.search-view-loading .text-detail').html(message);
            }
            this.$('.search-view-loading').removeClass('hidden');
        },
        hideLoading: function() {
            this.$('.search-view-loading').addClass('hidden');
        },
        showError: function(message) {
            if (message) {
                this.$('.search-view-error .text-detail').html(message);
            }
            else {
                this.$('.search-view-error .text-detail').html(this.searchAttributes.errorMessage);
            }
            this.$('.search-view-error').removeClass('hidden');
        },
        hideError: function() {
            this.$('.search-view-error').addClass('hidden');
        },
        showInfo: function(message) {
            if (message) {
                this.$('.search-view-info .text-detail').html(message);
            }
            this.$('.search-view-info').removeClass('hidden');
        },
        hideInfo: function() {
            this.$('.search-view-info').addClass('hidden');
        },
        hideIndicators: function() {
            this.hideLoading();
            this.hideError();
            this.hideInfo();
        },
        resetSearchQueryInput: function() {
            this.$('.personnel-search-query').val('');
            this.showClearSearchButton();
        },
        doSearch: function() {
            var currentContext = this;
            if (currentContext.model.get("searchMethod") === SearchMethodsEnum.manual) {
                currentContext.showManualSearch(null, true);
                currentContext.doManualSearch();
            } else {
                currentContext.showGpsSearch();
            }
        },
        doManualSearch: function(event) {
            var searchQuery = this.$('.personnel-search-query').val();
            if (!searchQuery || searchQuery.length < 2) {
                this.model.resetPersonnelSearchResults(SearchMethodsEnum.manual);
                this.hideIndicators();
            } else {
                this.hideIndicators();
                this.showLoading();
                this.model.performManualPersonnelSearch(searchQuery, this.onManualFetchSuccess, this.onFetchError);
            }
        },
        doGpsSearch: function() {
            this.hideIndicators();
            this.showLoading();
            this.model.performGpsPersonnelSearch(this.onFetchSuccess, this.onFetchError);
        },
        onFetchSuccess: function(searchResultsCollection) {
            this.hideIndicators();
            if (!searchResultsCollection || searchResultsCollection.length === 0) {
                this.showInfo();
            }
        },
        onManualFetchSuccess: function(searchResultsCollection) {
            var currentContext = this;
            this.hideIndicators();
            if (searchResultsCollection.length > 0) {
                var searchQuery = this.model.get("searchQuery");
                if (searchQuery && searchQuery.length > 2) {
                    var searchTerms = this.model.get("searchQuery").split(' ');
                    _.each(searchTerms, function(searchTerm) {
                        $('.manual-personnel-search-list', currentContext.el).highlight(searchTerm);
                    });
                }
            } else {
                this.showInfo();
            }
        },
        onGpsError: function(errorMessage) {
            this.hideIndicators();
            this.showError(errorMessage);
        },
        onFetchError: function(errorMessage) {
            this.hideIndicators();
            this.showError(errorMessage);
        },
        goToDirections: function(event) {
            if (event) {
                event.preventDefault();
            }
            var latitude = $(event.target).data('latitude');
            var longitude = $(event.target).data('longitude');
            if (latitude && longitude) {
                this.controller.goToDirectionsLatLon(latitude, longitude);
            }
        }
    });

    return PersonnelSearchView;
});
