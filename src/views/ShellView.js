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
            this.listenTo(this.dispatcher, EventNameEnum.showProgressView, this.showProgressView);

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
            currentContext.replaceWithChild(currentContext.headerView, '#header-view-placeholder');
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
            currentContext.replaceWithChild(currentContext.footerView, '#footer-view-placeholder');
            return this;
        },
        
        /**
         * 
         * @returns {ShellView}
         */
        renderProgressModalView: function(){
            var currentContext = this;
            currentContext.progressModalView = new ProgressModalView({
                dispatcher: currentContext.dispatcher
            });
            currentContext.renderChildInto(currentContext.progressModalView, '#progress-modal-view-container');
            return this;
        },
        
        /**
         * 
         * @returns {ShellView}
         */
        renderConfirmationModalView: function(){
            var currentContext = this;
            currentContext.confirmationModalView = new ConfirmationModalView({
                dispatcher: currentContext.dispatcher
            });
            currentContext.renderChildInto(currentContext.confirmationModalView, '#confirmation-modal-view-container');
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
         * @param {type} confirmationType
         * @param {type} confirmationMessage
         * @returns {ShellView}
         */
        showConfirmationView: function(confirmationType, header, message) {
            var currentContext = this;
            currentContext.confirmationModalView.show(confirmationType, header, message);
            return this;
        },
        
        /**
         * 
         * @param {type} promise
         * @returns {ShellView}
         */
        showProgressView: function(promise, message) {
            var currentContext = this;
            currentContext.progressModalView.show(promise, message);
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