define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var CompositeView = require('views/CompositeView');

    var BaseView = function (options) {
        CompositeView.apply(this, [options]);
    };

    _.extend(BaseView.prototype, CompositeView.prototype, {
        /**
         *
         * @returns {BaseView}
         */
        completeLoading: function () {
            var currentContext = this;
            currentContext.trigger('loaded');
            return this;
        }
    });

    BaseView.extend = CompositeView.extend;

    return BaseView;

});