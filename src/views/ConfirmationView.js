define(function (require) {

    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        BasePopupView = require('views/base/BasePopupView'),
        template = require('hbs!templates/Confirmation');

    return BasePopupView.extend({
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

});
