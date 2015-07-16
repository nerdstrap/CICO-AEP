define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseModalView = require('views/BaseModalView');
    var config = require('config');
    var EventNameEnum = require('enums/EventNameEnum');
    var validation = require('backbone-validation');
    var template = require('hbs!templates/ProgressModalView');

    var ProgressModalView = BaseModalView.extend({
        initialize: function(options) {
            console.debug('ProgressView.initialize');
            options || (options = {});
            this.modal = true;
        },
        render: function() {
            this.$el.addClass("hidden");
            this.$el.html(template({
                messageText: "Sending data"
            }));
            //            this.$el.magnificModal();

            return this;
        },
        /*
         * 
         * 
         * beforeShow: function(errorMessage) {
         this.errorMessage = errorMessage;
         this.render();
         this.$el.removeClass("hidden");
         
         return true;
         }
         */

        beforeShow: function(promise) {
            //            this.$el.removeClass("hidden");
            // TODO update this to allow for multiple promises
            this.promise = promise;
            var currentContext = this;
            if (this.promise && this.promise.state() === "pending") {
                // don't hide the modal for at least a second (to allow it to fully show)
                // 8/16 - shortened this to 100 ms to 
                setTimeout(function() {
                    currentContext.promise.always(function() {
                        /* add a 10 ms wait so the modal overlay does not flash away before the confirmation view shows up */
                        setTimeout(function() {
                            currentContext.hide();
                        }, 10);
                    });
                }, 10);

                this.render();
                this.$el.removeClass("hidden");

                return true;
            }

            return false;
        }

    });
    return ProgressModalView;
});