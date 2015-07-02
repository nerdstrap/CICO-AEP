define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            StationWarningModel = require('models/StationWarningModel'),
            CompositeView = require('views/base/CompositeView'), 
            ConfirmWarningListItemView = require('views/ConfirmWarningListItemView'), 
            template = require('hbs!templates/ConfirmWarningList'),
            cicoEvents = require('cico-events');

    var ConfirmWarningListView = CompositeView.extend({
        stationWarningsLoadingMessage: 'Getting Station Warnings...',
        defaultTitleText: 'Station Warnings',
        stationWarningsErrorMessage: 'Error - Station Warnings',
        getDefaultsForRendering: function() {
            return {
                stationWarningsLoadingMessage: this.stationWarningsLoadingMessage,
                defaultTitleText: this.defaultTitleText,
                stationWarningsErrorMessage: this.stationWarningsErrorMessage
            };
        },
        initialize: function(options) {
            console.debug('StationWarningListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenToOnce(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'error', this.handleServiceError);
            this.listenTo(cicoEvents, cicoEvents.clearWarningSuccess, this.onClearWarningSuccess);
        },
        events: {
            'click .section-button': 'toggleContent'
        },
        render: function() {
            console.debug('StationWarningListView.render()');
            var renderModel = this.getDefaultsForRendering();
            this.$el.html(template(renderModel));
            return this;
        },
        addAll: function() {

            var currentContext = this;
            currentContext._leaveChildren();
            
            currentContext.renderWarningViews();

            currentContext.$('.station-warnings-loading').addClass('hidden');
            currentContext.$('.station-warnings-error').addClass('hidden');
            currentContext.$('.station-warnings-title').removeClass('hidden');
        },
        addOne: function(stationWarning) {
            var currentContext = this;
            var confirmWarningListItemView = new ConfirmWarningListItemView({
                model: stationWarning,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(confirmWarningListItemView, '.station-warnings');
        },
        renderWarningViews: function() {
            var currentContext = this;
            _.each(currentContext.collection.models, currentContext.addOne, currentContext);
        },
        onClearWarningSuccess: function(stationWarningModel) {
            this.collection.remove(this.collection.where({stationWarningId: stationWarningModel.stationWarningId}));
        },
        handleServiceError: function() {
            this.hideLoading();
            this.disable();
            this.showError('Error - Station Warnings');
        },
        disable: function() {
            this.$el.addClass('disabled');
        },
        enable: function() {
            this.$el.removeClass('disabled');
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
            this.$(".station-warnings-loading").removeClass('hidden');
            this.$(".loading-text-label").html(loadingText);
        },
        hideLoading: function() {
            this.$(".station-warnings-loading").addClass('hidden');
        },
        showTitle: function(titleText){
            this.$(".station-warnings-title").removeClass('hidden');
            this.$(".title-text-label").html(titleText);
        },
        hideTitle: function(){
            this.$(".station-warnings-title").addClass('hidden');
        },
        showError: function(errorText) {
            this._leaveChildren();
            this.$(".station-warnings-error").removeClass('hidden');
            this.$(".error-text-label").html(errorText);
        },
        hideError: function() {
            this.$(".conditions-error").addClass('hidden');
        }
    });

    return ConfirmWarningListView;
});