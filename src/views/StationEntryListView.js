define(function(require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/base/CompositeView'),
        StationEntryListItemView = require('views/StationEntryListItemView'),
        NameLinkTypeEnum = require('enums/NameLinkTypeEnum'),
        StationEntryListTypeEnum = require('enums/StationEntryListTypeEnum'),
        template = require('hbs!templates/StationEntryList');

    var StationEntryListView = CompositeView.extend({
        getEntriesLoadingMessage: function() {
            if (this.openOnly){
                return 'Getting Open Check-ins&#8230;';
            }
            return 'Getting Recent Check-ins&#8230;';
        },
        getEntriesTitleText: function(entriesCount) {
            if (this.stationEntryListType === StationEntryListTypeEnum.open) {
                return entriesCount.toString() + ' Checked-in';
            } else {
                return 'Recent Check-ins (Yesterday &#38; Today)';
            }
            return 'Check-ins';
        },
        getNoEntriesTitleText: function() {
            if (this.stationEntryListType === StationEntryListTypeEnum.open) {
                return 'No One Checked-in';
            } else {
                return 'No Recent Check-ins';
            }
            return 'No Check-ins';
        },
        getEntriesErrorMessage: function() {
            if (this.stationEntryListType === StationEntryListTypeEnum.open) {
                return 'Error&#8212;Open Check-ins';
            }
            return 'Error&#8212;Recent Check-ins';
        },
        getDefaultsForRendering: function() {
            return {
                entriesLoadingMessage: this.getEntriesLoadingMessage(),
                defaultEntriesTitleText: this.getNoEntriesTitleText(),
                entriesErrorMessage: this.getEntriesErrorMessage()
            };
        },
        initialize: function(options) {
            console.debug('StationEntryListView.initialize');
            options || (options = {});
            this.appDataModel = options.appDataModel;
            this.stationEntryListType = options.stationEntryListType || StationEntryListTypeEnum.historical;
            this.nameLinkType = options.nameLinkType || NameLinkTypeEnum.personnel;
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'error', this.handleServiceError);
        },
        events: {
            'click .section-button': 'toggleContent'
        },
        render: function() {
            console.debug('StationEntryListView.render');
            var renderModel = this.getDefaultsForRendering();
            this.$el.html(template(renderModel));
            return this;
        },
        addAll: function() {
            var currentContext = this;
            currentContext._leaveChildren();

            var showOpenStationEntriesOnly = (currentContext.stationEntryListType === StationEntryListTypeEnum.open);
            var entries = _.filter(currentContext.collection.models, function(stationEntry) {
                return stationEntry.derivedAttributes.checkedOut !== showOpenStationEntriesOnly;
            });

            if (entries && entries.length > 0) {
                _.each(entries, currentContext.addOne, currentContext);
                currentContext.showTitle(this.getEntriesTitleText(entries.length));
                currentContext.enable();
                if (currentContext.nameLinkType === NameLinkTypeEnum.station) {
                    currentContext.openContent();
                }
            }
            else {
                currentContext.showTitle(currentContext.getNoEntriesTitleText());
                currentContext.collapseContent();
                currentContext.disable();
            }
            
            currentContext.hideLoading();
        },
        addOne: function(stationEntryModel) {
            var currentContext = this;
            var stationEntryListItemView = new StationEntryListItemView({
               model: stationEntryModel,
               nameLinkType: currentContext.nameLinkType,
               dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(stationEntryListItemView, '.station-entries');
        },
        handleServiceError: function() {
            this.hideLoading();
            this.disable();
            this.showError('Error - Check Ins');
        },
        disable: function() {
            this.$el.addClass('disabled');
        },
        enable: function() {
            this.$el.removeClass('disabled');
        },
        showSectionTitle: function(){
            this.$(".title").removeClass('hidden');
        },
        hideSectionTitle: function(){
            this.$(".title").addClass('hidden');
        },
        toggleContent: function(event) {
            if (event) {
                if ($(event.target).closest('section').hasClass('disabled')) {
                    event.preventDefault();
                    return false;
                }
            }
        },
        openContent: function() {
            this.$el.addClass('active');
        },
        collapseContent: function() {
            this.$el.removeClass('active');
        },
        showLoading: function(loadingText) {
            this.$(".entries-loading").removeClass('hidden');
            this.$(".loading-text-label").html(loadingText);
        },
        hideLoading: function() {
            this.$(".entries-loading").addClass('hidden');
        },
        showTitle: function(titleText){
            this.$(".entries-title").removeClass('hidden');
            this.$(".title-text-label").html(titleText);
        },
        hideTitle: function(){
            this.$(".entries-title").addClass('hidden');
        },
        showError: function(errorText) {
            this._leaveChildren();
            this.$(".entries-error").removeClass('hidden');
            this.$(".error-text-label").html(errorText);
        },
        hideError: function() {
            this.$(".entries-error").addClass('hidden');
        }
    });
    
    return StationEntryListView;

});