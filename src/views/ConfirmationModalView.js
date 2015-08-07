define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseModalView = require('views/BaseModalView');
    var EventNameEnum = require('enums/EventNameEnum');
    var template = require('hbs!templates/ConfirmationModalView');

    var ConfirmationModalView = BaseModalView.extend({
        
        id: '#confirmation-modal-view',
        
        initialize: function (options) {
            BaseModalView.prototype.initialize.apply(this, arguments);
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'error', this.onError);
        },

        render: function () {
            this.setElement(template(this.renderModel(this.model)));
            return this;
        },

        events: {
            'click .ok-modal-button': 'hide'
        },

        beforeShow: function (confirmationType, header, message) {
            this.updateConfirmationHeader(header);
            this.updateConfirmationMessage(message);
            return this;
        },

        updateConfirmationHeader: function (header) {
            this.$('#confirmation-header-label').text(header);
            return this;
        },

        updateConfirmationMessage: function (message) {
            this.$('#confirmation-message').text(message);
            return this;
        },

        onLoaded: function () {
            this.showLoading();
        },

        onError: function (error) {
            this.showError(error);
        }

    });

    return ConfirmationModalView;
});
