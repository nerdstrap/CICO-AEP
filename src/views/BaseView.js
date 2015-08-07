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

        initialize: function () {
            CompositeView.prototype.initialize.apply(this, arguments);
        },

        renderModel: function (model) {
            var baseAttributes = {
                cid: this.cid
            };
            var renderModel;
            if (model) {
                renderModel = _.extend({}, baseAttributes, model.attributes);
            } else {
                renderModel = _.extend({}, baseAttributes);
            }
            return renderModel;
        }
    });

    BaseView.extend = CompositeView.extend;

    return BaseView;

});