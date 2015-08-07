define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseFormView = require('views/BaseFormView');

    var BaseModalView = function (options) {
        BaseFormView.apply(this, [options]);
    };

    _.extend(BaseModalView.prototype, BaseFormView.prototype, {

        initialize: function () {
            BaseFormView.prototype.initialize.apply(this, arguments);
        },

        show: function (options) {
            var currentContext = this;
            currentContext.trigger('before-show', options);
            $(currentContext.id).foundation('reveal', 'open', {
                root_element: '#modal-view-container'
            });
            currentContext.trigger('after-show', options);
            return this;
        },

        hide: function (options) {
            var currentContext = this;
            currentContext.trigger('before-hide', options);
            $(currentContext.id).foundation('reveal', 'close');
            currentContext.trigger('after-hide', options);
            currentContext.leave();
            return this;
        }
    });

    BaseModalView.extend = BaseFormView.extend;

    return BaseModalView;

});