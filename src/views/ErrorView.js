define(function (require) {

    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        BasePopupView = require('views/base/BasePopupView'),
        template = require('hbs!templates/Error');

    return BasePopupView.extend({

        initialize: function (options) {
            console.debug("ErrorView.initialize");
            options || (options = {});
            this.errorMessage = options.errorMessage;
        },

        render: function () {
            console.debug("ErrorView.render");
            this.$el.addClass("hidden");
            this.$el.html(template({
                errorMessage: this.errorMessage
            }));

            return this;
        },

        beforeShow: function (errorMessage) {
            this.errorMessage = errorMessage;
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