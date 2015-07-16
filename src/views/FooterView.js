define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var EventNameEnum = require('enums/EventNameEnum');
    var template = require('hbs!templates/FooterView');

    var FooterView = BaseView.extend({
        /**
         * 
         * @param {type} options
         */
        initialize: function(options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
        },
        /**
         * 
         * @returns {FooterView}
         */
        render: function() {
            var currentContext = this;
            currentContext.setElement(template());
            return this;
        },
        
        /**
         * 
         */
        events: {
            'click #open-help-button': 'openHelp',
            'click #contact-support-button': 'contactSupport',
            'click #logout-button': 'logout'
        },
        
        /**
         * 
         * @param {type} event
         */
        openHelp: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.dispatcher.trigger(EventNameEnum.openHelp);
        },
        
        /**
         * 
         * @param {type} event
         */
        contactSupport: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.dispatcher.trigger(EventNameEnum.contactSupport);
        },
        
        /**
         * 
         * @param {type} event
         */
        logout: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.dispatcher.trigger(EventNameEnum.logout);
        },
        
        /**
         * 
         */
        onLoaded: function() {
            console.trace('FooterView.onLoaded');
        },
        
        /**
         * 
         */
        onLeave: function() {
            console.trace('FooterView.onLeave');
        }
    });
    
    return FooterView;

});