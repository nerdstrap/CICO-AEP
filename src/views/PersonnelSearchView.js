define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var PersonnelCollectionView = require('views/PersonnelCollectionView');
    var PersonnelCollection = require('collections/PersonnelCollection');
    var EventNameEnum = require('enums/EventNameEnum');
    var SearchMethodEnum = require('enums/SearchMethodEnum');
    var PersonnelTypeEnum = require('enums/PersonnelTypeEnum');
    var template = require('hbs!templates/PersonnelSearchView');

    var PersonnelSearchView = BaseView.extend({
        initialize: function(options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.myPersonnelModel = options.myPersonnelModel;
            this.openPersonnelEntryLogModel = options.openPersonnelEntryLogModel;

            this.searchAttributes = {
                manualSearchWatermark: 'enter a personnel name...',
                loadingMessage: 'Getting personnels...',
                errorMessage: 'System not available at this time. Please call the dispatch center to check in.',
                infoMessage: 'No results.'
            };
            this.keyUpDelay = 200;
            this.searchMethod = SearchMethodEnum.gps;

            this.listenTo(this.dispatcher, EventNameEnum.checkInSuccess, this.onCheckInSuccess);
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function() {
            var currentContext = this;
            currentContext.setElement(template(currentContext.searchAttributes));
            currentContext.renderPersonnelCollectionView();
            return this;
        },
        renderPersonnelCollectionView: function() {
            var currentContext = this;
            currentContext.personnelCollection = new PersonnelCollection();
            currentContext.personnelCollectionView = new PersonnelCollectionView({
                dispatcher: currentContext.dispatcher,
                myPersonnelModel: currentContext.myPersonnelModel,
                collection: currentContext.personnelCollection
            });
            currentContext.renderChildInto(currentContext.personnelCollectionView, '#personnel-list-view-container');
            return this;
        },
        events: {
            'click #gpsSearchBtn': 'showGpsSearch',
            'click #manualSearchBtn': 'showManualSearch',
            'click #recentSearchBtn': 'showRecentSearch',
            'click #clearManualSearchBtn': 'clearManualSearch',
            'keyup .personnel-search-query': 'searchKeyUp',
            'keypress .personnel-search-query': 'onKeyPress',
            'click #includeDol': 'setPrevFilterPersonnelTypes',
            'click #includeNoc': 'setPrevFilterPersonnelTypes',
            'click #showAdHocCheckInModalBtn': 'showAdHocCheckInModal',
            'click #goToOpenCheckInBtn': 'goToOpenCheckIn'
        },
        updateViewFromModel: function() {
            var currentContext = this;
            if (currentContext.myPersonnelModel.get('userRole').indexOf('TC') > 0) {
                currentContext.showPersonnelTypeFilter();
                if (currentContext.openPersonnelEntryLogModel.has('personnelEntryLogId')) {
                    currentContext.hideShowAdHocCheckInModalButton();
                    currentContext.showGoToOpenCheckInButton();
                } else {
                    currentContext.showShowAdHocCheckInModalButton();
                    currentContext.hideGoToOpenCheckInButton();
                }
            } else {
                currentContext.hidePersonnelTypeFilter();
            }
        },
        onKeyPress: function(event) {
            if (event) {
                if (event.keyCode === 13) {
                    /* enter key pressed */
                    event.preventDefault();
                }
            }
        },
        searchKeyUp: function(event) {
            if (this.searchKeyUp.timeout) {
                clearTimeout(this.searchKeyUp.timeout);
            }
            var currentContext = this;
            currentContext.searchKeyUp.timeout = setTimeout(function() {
                currentContext.doSearch.call(currentContext, event);
            }, currentContext.keyUpDelay);
            currentContext.showClearSearchButton();
        },
        showGpsSearch: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.searchMethod = SearchMethodEnum.gps;
            currentContext.hideIndicators();
            currentContext.hideManualSearchControls();
            currentContext.$('#ad-hoc-btn-container').addClass('hidden');
            currentContext.$('#open-ad-hoc-btn-container').addClass('hidden');
            currentContext.$('#gpsSearchBtn').removeClass('cico-default');
            currentContext.$('#manualSearchBtn').addClass('cico-default');
            currentContext.$('#recentSearchBtn').addClass('cico-default');
            currentContext.doSearch();
            return this;
        },
        showManualSearch: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.searchMethod = SearchMethodEnum.manual;
            currentContext.hideIndicators();
            currentContext.showClearSearchButton();
            currentContext.showManualSearchControls();
            currentContext.$('#manualSearchBtn').removeClass('cico-default');
            currentContext.$('#gpsSearchBtn').addClass('cico-default');
            currentContext.$('#recentSearchBtn').addClass('cico-default');
            currentContext.doSearch();
            return this;
        },
        showRecentSearch: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.searchMethod = SearchMethodEnum.recent;
            currentContext.hideIndicators();
            currentContext.hideManualSearchControls();
            currentContext.$('#recentSearchBtn').removeClass('cico-default');
            currentContext.$('#gpsSearchBtn').addClass('cico-default');
            currentContext.$('#manualSearchBtn').addClass('cico-default');
            currentContext.doSearch();
            return this;
        },
        clearManualSearch: function(event) {
            if (event) {
                event.preventDefault();
                this.$('.personnel-search-query').focus();
            }
            this.resetSearchQueryInput();
            this.hideIndicators();
        },
        resetSearchQueryInput: function() {
            this.$('.personnel-search-query').val('');
            this.showClearSearchButton();
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
        showPersonnelTypeFilter: function() {
            var currentContext = this;
            currentContext.$('#personnel-type-filter-container').removeClass('hidden');
            return this;
        },
        hidePersonnelTypeFilter: function() {
            var currentContext = this;
            currentContext.$('#personnel-type-filter-container').addClass('hidden');
            return this;
        },
        showManualSearchControls: function() {
            var currentContext = this;
            currentContext.$('#manual-search-controls-container').removeClass('hidden');
            return this;
        },
        hideManualSearchControls: function() {
            var currentContext = this;
            currentContext.$('#manual-search-controls-container').addClass('hidden');
            return this;
        },
        showShowAdHocCheckInModalButton: function() {
            var currentContext = this;
            currentContext.$('#go-to-ad-hoc-btn-container').removeClass('hidden');
            return this;
        },
        hideShowAdHocCheckInModalButton: function() {
            var currentContext = this;
            currentContext.$('#go-to-ad-hoc-btn-container').addClass('hidden');
            return this;
        },
        showGoToOpenCheckInButton: function() {
            var currentContext = this;
            currentContext.$('#go-to-open-entry-btn-container').removeClass('hidden');
            return this;
        },
        hideGoToOpenCheckInButton: function() {
            var currentContext = this;
            currentContext.$('#go-to-open-entry-btn-container').addClass('hidden');
            return this;
        },
        hideIndicators: function() {
            var currentContext = this;
            currentContext.hideLoading();
            currentContext.hideError();
            currentContext.hideInfo();
            return this;
        },
        showLoading: function(message) {
            var currentContext = this;
            currentContext.$('.search-view-loading').removeClass('hidden');
            return this;
        },
        hideLoading: function() {
            var currentContext = this;
            currentContext.$('.search-view-loading').addClass('hidden');
            return this;
        },
        showError: function(message) {
            var currentContext = this;
            currentContext.$('.search-view-error .text-detail').text(message);
            currentContext.$('.search-view-error').removeClass('hidden');
            return this;
        },
        hideError: function() {
            var currentContext = this;
            currentContext.$('.search-view-error .text-detail').text('');
            currentContext.$('.search-view-error').addClass('hidden');
            return this;
        },
        showInfo: function(message) {
            var currentContext = this;
            currentContext.$('.search-view-info .text-detail').text(message);
            currentContext.$('.search-view-info').removeClass('hidden');
            return this;
        },
        hideInfo: function() {
            var currentContext = this;
            currentContext.$('.search-view-info .text-detail').text('');
            currentContext.$('.search-view-info').addClass('hidden');
            return this;
        },
        doSearch: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;

            var options = {
            };

            if (currentContext.$("#includeDol").prop("checked") && currentContext.$("#includeNoc").prop("checked")) {
                options.includeNoc = true;
                options.includeDol = true;
            } else if (currentContext.$("#includeDol").prop("checked")) {
                options.includeDol = true;
            } else if (currentContext.$("#includeNoc").prop("checked")) {
                options.includeNoc = true;
            }

            if (currentContext.searchMethod === SearchMethodEnum.manual) {
                var personnelName = currentContext.$('.personnel-search-query').val();
                if (personnelName.length > 1) {
                    options.personnelName = personnelName;
                } else {
                    return this;
                }
            }

            if (currentContext.searchMethod === SearchMethodEnum.gps) {
                currentContext.dispatcher.trigger(EventNameEnum.refreshPersonnelCollectionByGps, currentContext.personnelCollection, options);
            } else {
                currentContext.dispatcher.trigger(EventNameEnum.refreshPersonnelCollection, currentContext.personnelCollection, options);
            }
            return this;
        },
        goToAdHocCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;

            if (!this.$('#showAdHocCheckInModalBtn').hasClass('disabled')) {
                this.dispatcher.trigger(currentContext.dispatcher.goToAdHocCheckIn);
            }
        },
        goToOpenCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;

            if (!this.$('#goToOpenCheckInBtn').hasClass('disabled')) {
                var personnelEntryLogId = this.openPersonnelEntryLogModel.get('personnelEntryLogId');
                this.dispatcher.trigger(currentContext.dispatcher.goToOpenCheckInWithId, personnelEntryLogId);
            }
        },
        onCheckInSuccess: function(newPersonnelEntryLogModel) {
            var currentContext = this;
            this.openPersonnelEntryLogModel.set(newPersonnelEntryLogModel.attributes);
            this.updateViewFromModel();
        },
        onLoaded: function() {
            var currentContext = this;
            this.updateViewFromModel();
            this.doSearch();
        },
        onLeave: function() {
            var currentContext = this;
        }
    });

    return PersonnelSearchView;
});
