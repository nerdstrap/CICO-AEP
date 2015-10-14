'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var template = require('templates/FooterView.hbs');

var FooterView = BaseView.extend({

    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, arguments);
        options || (options = {});
        this.dispatcher = options.dispatcher || this;
    },

    render: function () {
        this.setElement(template(this.renderModel(this.model)));
        return this;
    },

    events: {
        'click #open-help-button': 'openHelp',
        'click #contact-support-button': 'contactSupport',
        'click #logout-button': 'logout'
    },

    openHelp: function (event) {
        if (event) {
            event.preventDefault();
        }
        this.dispatcher.trigger(EventNameEnum.openHelp);
    },

    contactSupport: function (event) {
        if (event) {
            event.preventDefault();
        }
        this.dispatcher.trigger(EventNameEnum.contactSupport);
    },

    logout: function (event) {
        if (event) {
            event.preventDefault();
        }
        this.dispatcher.trigger(EventNameEnum.logout);
    }

});

module.exports = FooterView;