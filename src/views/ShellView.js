define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            template = require('hbs!templates/Shell');

    return Backbone.View.extend({
        
        initialize: function(options) {
            console.debug('ShellView.initialize');
            options || (options = {});
            this.titleBarViewInstance = options.titleBarView;
            this.footerViewInstance = options.footerView;
            this.progressViewInstance = options.progressView;
            this.errorViewInstance = options.errorView;
            this.confirmationViewInstance = options.confirmationView;
            this.loginViewInstance = options.loginView;
            this.warningViewInstance = options.warningView;
        },
                
        render: function() {
            console.debug('ShellView.render');
            this.$el.html(template());
            var subViews = [
                this.titleBarViewInstance,
                this.footerViewInstance,
                this.progressViewInstance,
                this.errorViewInstance,
                this.confirmationViewInstance,
                this.warningViewInstance
            ];
            _.each(subViews, function(view) {
                view.render();
                this.$('#' + view.id).replaceWith(view.el);
            }, this);

            return this;
        },
                
        events: {},
        
        titleBarView: function() {
            return this.titleBarViewInstance;
        },
                
        contentViewEl: function() {
            return $('#contentView', this.el);
        },
                
        footerView: function() {
            return this.footerViewInstance;
        },
                
        progressView: function() {
            return this.progressViewInstance;
        },
                
        errorView: function() {
            return this.errorViewInstance;
        },
           
        warningView: function() {
            return this.warningViewInstance;
        },
                
        confirmationView: function() {
            return this.confirmationViewInstance;
        },
                
        loginView: function() {
            return this.loginViewInstance;
        }

    });

});