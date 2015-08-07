define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    /**
     * Creates a new SwappingRouter with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var SwappingRouter = function(options) {
        Backbone.Router.apply(this, [options]);
    };

    _.extend(SwappingRouter.prototype, Backbone.Router.prototype, {
        /** Cleans up resources used by the previous view
         * @param {object} newContentView 
         */
        swapContent: function(newContentView) {
            if (this.currentContentView && this.currentContentView.leave) {
                this.currentContentView.leave();
            }

            this.currentContentView = newContentView;
            $(this.contentViewEl).html(this.currentContentView.render().el);

            if (this.currentContentView && this.currentContentView.swapped) {
                this.currentContentView.swapped();
                $('html, body').animate({
                    scrollTop: $('body').offset().top
                }, 250);
            }
        },

        showModal: function(newModalView) {
            if (this.currentModalView && this.currentModalView.leave) {
                this.currentModalView.leave();
            }

            this.currentModalView = newModalView;
            $(this.modalViewEl).append(this.currentModalView.render().el);

            if (this.currentModalView && this.currentModalView.swapped) {
                this.currentModalView.swapped();
            }

            if (this.currentModalView && this.currentModalView.show) {
                this.currentModalView.show();
            }
        }

    });

    SwappingRouter.extend = Backbone.Router.extend;

    return SwappingRouter;
});