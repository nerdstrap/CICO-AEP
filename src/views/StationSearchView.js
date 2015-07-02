define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/base/CompositeView'),
            SearchMethodsEnum = require('enums/SearchMethodsEnum'),
            FilterStationTypeEnum = require('enums/FilterStationTypeEnum'),
            env = require('env'),
            StationListView = require('views/StationListView'),
            template = require('hbs!templates/StationSearch'),
            cicoEvents = require('cico-events');

    var StationSearchView = CompositeView.extend({
        className: 'search-view station-search-view',
        initialize: function(options) {
            console.debug('StationSearchView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.myPersonnelModel = options.myPersonnelModel;
            this.searchAttributes = {
                manualSearchWatermark: 'enter a station name...',
                loadingMessage: 'Getting stations...',
                errorMessage: 'System not available at this time. Please call the dispatch center to check in.',
                infoMessage: 'No results.'
            };
            this.listenToOnce(this.myPersonnelModel, 'change', this.hideFilterStation);
            this.keyUpDelay = 200;

            _.bindAll(this, 'onFetchSuccess', 'onFetchError', 'onGpsError');
        },
        render: function() {
            var currentContext = this;
            this.$el.html(template(this.searchAttributes));

            this.gpsSearchBtn = this.$('#gpsSearchBtn');
            this.manualSearchBtn = this.$('#gpsSearchBtn');
            this.recentSearchBtn = this.$('#recentSearchBtn');
            this.clearManualSearch = this.$('#clearManualSearch');
            this.searchListLoadingControl = this.$('.list-view-loading');

            var searchQuery = currentContext.model.get("searchQuery");
            if (searchQuery && searchQuery.length > 0) {
                this.$('.station-search-query').val(searchQuery);
            }

            var stationListView = new StationListView({
                collection: currentContext.model.results,
                el: $('.station-search-list', currentContext.el),
                dispatcher: currentContext.dispatcher
            });
            this.renderChild(stationListView);
            this.hideFilterStation();
            return this;
        },
        events: {
            'click #gpsSearchBtn': 'showGpsSearch',
            'click #manualSearchBtn': 'showManualSearch',
            'click #recentSearchBtn': 'showRecentSearch',
            'click #clearManualSearchBtn': 'clearManualSearch',
            'keyup .station-search-query': 'searchKeyUp',
            'keypress .station-search-query': 'onKeyPress',
            'click #filterTDStations': 'setPrevFilterStationTypes',
            'click #filterTComStations': 'setPrevFilterStationTypes',
            'click #showAdHocCheckInModalBtn': 'showAdHocCheckInModal',
            'click #goToOpenCheckInBtn': 'goToOpenCheckIn'
        },
        onKeyPress: function(event) {
            if (event) {
                if (event.keyCode === 13) {
                    /* enter key pressed */
                    event.preventDefault();
                }
            }
        },
        showGpsSearch: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.model.resetStationSearchResults(SearchMethodsEnum.gps);
            this.hideIndicators();
            this.hideManualSearchForm();
            this.$('#ad-hoc-btn-container').addClass('hidden');
            this.$('#open-ad-hoc-btn-container').addClass('hidden');
            this.$('#gpsSearchBtn').removeClass('cico-default');
            this.$('#manualSearchBtn').addClass('cico-default');
            this.$('#recentSearchBtn').addClass('cico-default');
            this.doGpsSearch();
        },
        showManualSearch: function(event, persistSearchQueryInput) {
            if (event) {
                event.preventDefault();
            }
            this.model.resetStationSearchResults(SearchMethodsEnum.manual);
            this.hideIndicators();
            if (!persistSearchQueryInput) {
                this.resetSearchQueryInput();
            }

            this.checkUserRole();
            this.showClearSearchButton();
            this.showManualSearchForm();
            this.$('#manualSearchBtn').removeClass('cico-default');
            this.$('#gpsSearchBtn').addClass('cico-default');
            this.$('#recentSearchBtn').addClass('cico-default');
        },
        showRecentSearch: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.model.resetStationSearchResults(SearchMethodsEnum.recent);
            this.hideIndicators();
            this.hideManualSearchForm();
            this.$('#ad-hoc-btn-container').addClass('hidden');
            this.$('#open-ad-hoc-btn-container').addClass('hidden');
            this.$('#recentSearchBtn').removeClass('cico-default');
            this.$('#gpsSearchBtn').addClass('cico-default');
            this.$('#manualSearchBtn').addClass('cico-default');
            this.doRecentSearch();
        },
        clearManualSearch: function(event) {
            if (event) {
                event.preventDefault();
                this.$('.station-search-query').focus();
            }
            this.model.resetStationSearchResults(SearchMethodsEnum.manual);
            this.hideIndicators();
            this.resetSearchQueryInput();
        },
        showClearSearchButton: function(showButton) {
            var show = showButton || (this.$('#manualSearchInput').val().length > 0);
            if (show) {
                this.$('#clearManualSearchBtn').show();
            }
            else {
                this.$('#clearManualSearchBtn').hide();
            }
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
        hideIndicators: function(skipLoading, skipError, skipInfo) {
            if (!skipLoading) {
                this.hideLoading();
            }
            if (!skipError) {
                this.hideError();
            }
            if (!skipInfo) {
                this.hideInfo();
            }
        },
        resetSearchQueryInput: function() {
            this.$('.station-search-query').val('');
            this.showClearSearchButton();
        },
        doSearch: function() {
            var currentContext = this;
            if (currentContext.model.get("searchMethod") === SearchMethodsEnum.manual) {
                currentContext.showManualSearch(null, true);
                currentContext.doManualSearch();
            }
            else if (currentContext.model.get("searchMethod") === SearchMethodsEnum.recent) {
                currentContext.showRecentSearch();
            }
            else {
                currentContext.showGpsSearch();
            }
        },
        doManualSearch: function(event) {
            var filterStationTypes = this.getFilterStationTypes();
            if (filterStationTypes !== null) {
                var searchQuery = this.$('.station-search-query').val();
                if (!searchQuery || searchQuery.length < 2) {
                    this.model.resetStationSearchResults(SearchMethodsEnum.manual);
                    this.hideIndicators();
                } else {
                    this.hideIndicators();
                    this.showLoading();
                    this.model.performManualStationSearchWithGps(searchQuery, this.onFetchSuccess, this.onFetchError, this.onGpsError, filterStationTypes);
                }
            }
        },
        doGpsSearch: function() {
            var filterStationTypes = this.getFilterStationTypes();
            if (filterStationTypes !== null) {
                this.hideIndicators();
                this.showLoading();
                this.model.performGpsStationSearch(this.onFetchSuccess, this.onFetchError, filterStationTypes);
            }
        },
        doRecentSearch: function() {
            var filterStationTypes = this.getFilterStationTypes();
            if (filterStationTypes !== null) {
                this.hideIndicators();
                this.showLoading();
                this.model.performRecentStationSearchWithGps(this.onFetchSuccess, this.onFetchError, this.onGpsError, filterStationTypes);
            }
        },
        getFilterStationTypes: function() {

            if (this.$("#filterTDStations").prop("checked") && this.$("#filterTComStations").prop("checked")) {
                return FilterStationTypeEnum.TDTC;
            } else if (this.$("#filterTDStations").prop("checked")) {
                return FilterStationTypeEnum.TD;
            } else if (this.$("#filterTComStations").prop("checked")) {
                return FilterStationTypeEnum.TC;
            } else {
                return null;
            }
            ;
        },
        setPrevFilterStationTypes: function() {
            var filterStationTypes = this.getFilterStationTypes();
            this.model.set('prevFilterStationTypes', filterStationTypes);
        },
        hideFilterStation: function() {
            if (this.myPersonnelModel.get('userRole') === FilterStationTypeEnum.TDTC) {
                this.$("#filter-station").removeClass("hidden");

                if (this.model.get('prevFilterStationTypes')) {
                    if (this.model.get('prevFilterStationTypes') === FilterStationTypeEnum.TDTC) {
                        this.$("#filterTDStations").prop("checked", true);
                        this.$("#filterTComStations").prop("checked", true);
                    } else if (this.model.get('prevFilterStationTypes') === FilterStationTypeEnum.TD) {
                        this.$("#filterTDStations").prop("checked", true);
                        this.$("#filterTComStations").prop("checked", false);
                    } else if (this.model.get('prevFilterStationTypes') === FilterStationTypeEnum.TC) {
                        this.$("#filterTDStations").prop("checked", false);
                        this.$("#filterTComStations").prop("checked", true);
                    } else {
                        this.$("#filterTDStations").prop("checked", true);
                        this.$("#filterTComStations").prop("checked", true);
                    }
                } else {
                    this.$("#filterTDStations").prop("checked", true);
                    this.$("#filterTComStations").prop("checked", true);
                }
                this.doSearch();
            } else if (this.myPersonnelModel.get('userRole') === FilterStationTypeEnum.TD) {
                this.$("#filterTDStations").prop("checked", true);
                this.$("#filterTComStations").prop("checked", false);
                this.doSearch();
            } 
        },
        onFetchSuccess: function(searchResultsCollection) {
            this.hideIndicators(false, true, false);
            if (!searchResultsCollection || searchResultsCollection.length === 0) {
                this.showInfo();
            }
        },
        onGpsError: function(errorMessage) {
            this.showError(errorMessage);
        },
        onFetchError: function(errorMessage) {
            this.hideIndicators();
            this.showError(errorMessage);
        },
        showAdHocCheckInModal: function(event) {
            if (event) {
                event.preventDefault();
            }

            if (!this.$('#showAdHocCheckInModalBtn').hasClass('disabled')) {
                this.dispatcher.trigger('goToAdHocCheckIn');
            }
        },
        checkUserRole: function() {
            var currentContext = this;
            if (this.model.appDataModel.get('userRole') === FilterStationTypeEnum.TDTC){
                currentContext.showAdHocCheckInBtn();
            } else {
                currentContext.hideAdHocCheckInBtn();
            }
        },
        hideAdHocCheckInBtn: function() {    
            this.$('#ad-hoc-btn-container').addClass('hidden');
            this.$('#open-ad-hoc-btn-container').addClass('hidden');
        },
        showAdHocCheckInBtn: function() {    
            var openStationEntry = this.model.appDataModel.get('openStationEntry');
            if (openStationEntry) {
                this.$('#open-ad-hoc-btn-container').removeClass('hidden');
                this.$('#ad-hoc-btn-container').addClass('hidden');
            } else {
                this.$('#open-ad-hoc-btn-container').addClass('hidden');
                this.$('#ad-hoc-btn-container').removeClass('hidden');
            }
        },
        goToOpenCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }

            if (!this.$('#goToOpenCheckInBtn').hasClass('disabled')) {
                this.dispatcher.trigger(cicoEvents.goToOpenCheckIn);
            }
        }
    });

    return StationSearchView;
});
