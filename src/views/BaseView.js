define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var CompositeView = require('views/CompositeView');

    var BaseView = function(options) {
        CompositeView.apply(this, [options]);
    };

    _.extend(BaseView.prototype, CompositeView.prototype, {
    });

    BaseView.extend = CompositeView.extend;

    return BaseView;

});