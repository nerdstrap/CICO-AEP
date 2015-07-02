define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            template = require('hbs!templates/Footer');

    return Backbone.View.extend({
        
        tagName: 'footer',
        
        initialize: function(options) {
            console.debug('FooterView.initialize');
            options || (options = {});
            this.footerCopy = options.footerCopy;
            this.controller = options.controller;
        },
                
        render: function() {
            console.debug('FooterView.render');
            this.$el.html(template({
                footerCopy: this.footerCopy
            }));

            return this;
        },
                
        setFooterCopy: function(footerCopy) {
            this.footerCopy = footerCopy;
            this.render();

            return this;
        },
                
        events: {
            'click #logoutButton': 'logOut',
            'click #openHelpButton': 'openHelp',
            'click #emailHelpButton': 'emailHelp'
        },
                
        logOut: function(event) {
            event.preventDefault();
            if (this.controller) {
                this.controller.logout();
            }
        },
        openHelp: function(event) {
            event.preventDefault();
            if (this.controller) {
                this.controller.openHelp();
            }
        },
         emailHelp: function(event) {
            event.preventDefault();
            if (this.controller) {
                this.controller.emailHelp();
            }
        }       
    });

});