define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var config = require('config');
    var EventNameEnum = require('enums/EventNameEnum');
    var HeaderView = require('views/HeaderView');
    var FooterView = require('views/FooterView');
    var ProgressModalView = require('views/ProgressModalView');
    var ConfirmationModalView = require('views/ConfirmationModalView');
    var template = require('hbs!templates/ShellView');

    var ShellView = BaseView.extend({
        
        /**
         * 
         * @param {type} options
         */
        initialize: function(options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.dispatcher, EventNameEnum.showConfirmationView, this.showConfirmationView);
            this.listenTo(this.dispatcher, EventNameEnum.showProgessView, this.showProgessView);

            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },
        
        /**
         * 
         * @returns {ShellView}
         */
        render: function() {
            var currentContext = this;
            currentContext.setElement(template());
            currentContext.renderHeaderView();
            currentContext.renderFooterView();
            currentContext.renderProgressModalView();
            currentContext.renderConfirmationModalView();
            return this;
        },
        
        /**
         * 
         * @returns {ShellView}
         */
        renderHeaderView: function(){
            var currentContext = this;
            currentContext.headerView = new HeaderView({
                dispatcher: currentContext.dispatcher
            });
            currentContext.replaceChild(currentContext.headerView, '#header-view-placeholder');
            return this;
        },
        
        /**
         * 
         * @returns {ShellView}
         */
        renderFooterView: function(){
            var currentContext = this;
            currentContext.footerView = new FooterView({
                dispatcher: currentContext.dispatcher
            });
            currentContext.replaceChild(currentContext.footerView, '#footer-view-placeholder');
            return this;
        },
        
        /**
         * 
         * @returns {ShellView}
         */
        renderProgressModalView: function(){
            var currentContext = this;
            currentContext.progressModalView = new ProgressModalView({
                id: 'progressModalView',
                dispatcher: currentContext.dispatcher
            });
            currentContext.renderChildInto(currentContext.progressModalView, '#progress-popup-view-container');
            return this;
        },
        
        /**
         * 
         * @returns {ShellView}
         */
        renderConfirmationModalView: function(){
            var currentContext = this;
            currentContext.confirmationModalView = new ConfirmationModalView({
                id: 'confirmationModalView',
                dispatcher: currentContext.dispatcher
            });
            currentContext.renderChildInto(currentContext.confirmationModalView, '#confirmation-popup-view-container');
            return this;
        },
        
        /**
         * 
         * @returns {jquery element}
         */
        contentViewEl: function() {
            return $('#content-view-container', this.el);
        },
        
        /**
         * 
         * @param {type} confirmationMessage
         * @param {type} confirmationType
         * @returns {ShellView}
         */
        showConfirmationView: function(confirmationMessage, confirmationType) {
            var currentContext = this;
            currentContext.confirmationView.show(confirmationMessage, confirmationType);
            return this;
        },
        
        /**
         * 
         * @param {type} promise
         * @returns {ShellView}
         */
        showProgressView: function(promise) {
            var currentContext = this;
            currentContext.progressView.show(promise);
            return this;
        },
        
        /**
         * 
         */
        onLoaded: function() {
            console.trace('ShellView.onLoaded');
        },
        
        /**
         * 
         */
        onLeave: function() {
            console.trace('ShellView.onLeave');
        }
    });

    return ShellView;

});