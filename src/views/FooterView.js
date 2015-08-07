define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var EventNameEnum = require('enums/EventNameEnum');
    var template = require('hbs!templates/FooterView');

    var FooterView = BaseView.extend({
        
        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
        },
        
        render: function() {
            this.setElement(template(this.renderModel(this.model)));
            return this;
        },
        
        events: {
            'click #open-help-button': 'openHelp',
            'click #contact-support-button': 'contactSupport',
            'click #logout-button': 'logout'
        },
        
        openHelp: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(EventNameEnum.openHelp);
        },
        
        contactSupport: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(EventNameEnum.contactSupport);
        },
        
        logout: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(EventNameEnum.logout);
        }

    });
    
    return FooterView;

});