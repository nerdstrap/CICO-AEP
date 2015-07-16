define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseModalView = require('views/BaseModalView');
    var config = require('config');
    var EventNameEnum = require('enums/EventNameEnum');
    var validation = require('backbone-validation');
    var template = require('hbs!templates/ConfirmationModalView');

    var ConfirmationModalView = BaseModalView.extend({
        initialize: function (options) {
            console.debug("ConfirmationView.initialize");
            options || (options = {});
            this.confirmationMessage = options.confirmationMessage;
        },

        render: function () {
            console.debug("ConfirmationView.render");
            this.$el.addClass("hidden");
            this.$el.html(template({
                confirmationMessage: this.confirmationMessage,
                confirmationType: this.confirmationType
            }));
            return this;
        },

        beforeShow: function (confirmationMessage,confirmationType) {
            this.confirmationMessage = confirmationMessage;
            this.confirmationType = confirmationType;
            this.render();
            this.$el.removeClass("hidden");
            return true;
        },
        events: {
            "click .closeModal": "closeWindow"
        },                
        closeWindow: function() {
            this.hide();
        }
    });

return ConfirmationModalView;
});
