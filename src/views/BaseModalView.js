define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var CompositeView = require('views/CompositeView');

    var BaseModalView = function (options) {
        CompositeView.apply(this, [options]);
    };

    _.extend(BaseModalView.prototype, CompositeView.prototype, {
        /**
         *
         * @returns {BaseModalView}
         */
        completeLoading: function () {
            var currentContext = this;
            currentContext.trigger('loaded');
            return this;
        }
    });

    BaseModalView.extend = CompositeView.extend;

    return BaseModalView;

});