define(function (require) {

    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        BasePopupView = require('views/base/BasePopupView'),
        template = require('hbs!templates/Warning');

    return BasePopupView.extend({

        initialize: function (options) {
            console.debug("WarningView.initialize");
            options || (options = {});
            this.errorMessage = options.errorMessage;
        },

        render: function () {
            console.debug("WarningView.render");
            this.$el.addClass("hidden");
            this.$el.html(template({
                warningMessage: this.warningMessage
            }));

            return this;
        },

        beforeShow: function (warningMessage) {
            this.warningMessage = warningMessage;
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