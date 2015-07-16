define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var config = require('config');
    var EventNameEnum = require('enums/EventNameEnum');
    var template = require('hbs!templates/AbnormalConditionCollectionView');

    var AbnormalConditionCollectionView = BaseView.extend({
        conditionsLoadingMessage: 'Getting Conditions...',
        defaultTitleText: 'Abnormal Conditions',
        conditionsErrorMessage: 'Error - Conditions',
        getDefaultsForRendering: function() {
            return {
                conditionsLoadingMessage: this.conditionsLoadingMessage,
                defaultTitleText: this.defaultTitleText,
                conditionsErrorMessage: this.conditionsLoadingMessage
            };
        },
        initialize: function(options) {
            console.debug('AbnormalConditionCollectionView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'error', this.handleServiceError);
        },
        events: {
            'click .section-button': 'toggleContent'
        },
        render: function() {
            console.debug('AbnormalConditionCollectionView.render');
            var renderModel = this.getDefaultsForRendering();
            this.$el.html(template(renderModel));
            return this;
        },
        addAll: function() {
            var currentContext = this;
            console.debug('AbnormalConditionCollectionView.addAll');
            currentContext._leaveChildren();
            _.each(currentContext.collection.models, currentContext.addOne, currentContext);

            var selfCount = currentContext.collection.models.length;
            if (selfCount < 1) {
                currentContext.$el.addClass('hidden');
            }
            else {
                currentContext.$('.conditions-loading').addClass('hidden');
                currentContext.$('.conditions-error').addClass('hidden');
                currentContext.$('.conditions-title').removeClass('hidden');
            }         
        },
        addOne: function(abnormalCondition) {
            var currentContext = this;
            var abnormalConditionTileView = new AbnormalConditionTileView({
                model: abnormalCondition,
                dispatcher: currentContext.dispatcher
            });
            this.appendChildTo(abnormalConditionTileView, '.abnormal-conditions');
        },
        handleServiceError: function() {
            this.hideLoading();
            this.disable();
            this.showError('Error - Conditions');
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
            this.$(".conditions-loading").removeClass('hidden');
            this.$(".loading-text-label").html(loadingText);
        },
        hideLoading: function() {
            this.$(".conditions-loading").addClass('hidden');
        },
        showTitle: function(titleText){
            this.$(".conditions-title").removeClass('hidden');
            this.$(".title-text-label").html(titleText);
        },
        hideTitle: function(){
            this.$(".conditions-title").addClass('hidden');
        },
        showError: function(errorText) {
            this._leaveChildren();
            this.$(".conditions-error").removeClass('hidden');
            this.$(".error-text-label").html(errorText);
        },
        hideError: function() {
            this.$(".conditions-error").addClass('hidden');
        }
    });

    return AbnormalConditionCollectionView;

});