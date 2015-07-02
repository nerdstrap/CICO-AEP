define(function (require) {

    "use strict";

    var $ = require('jquery'),
        Backbone = require('backbone'),
        template = require('hbs!templates/UserInfo');

    return Backbone.View.extend({

        initialize: function (options) {
            options || (options = {});
            this.model.on("reset", this.render, this);
            this.model.on("change", this.render, this);
        },

        render: function () {
            if (this.model.isLoaded) {
                this.$el.html(template(this.model.attributes));
            }
            return this;
        }

    });

});