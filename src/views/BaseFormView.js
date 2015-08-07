define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseDetailView = require('views/BaseDetailView');
    var utils = require('utils');

    var BaseFormView = function (options) {
        BaseDetailView.apply(this, [options]);
    };

    _.extend(BaseFormView.prototype, BaseDetailView.prototype, {

        initialize: function () {
            BaseDetailView.prototype.initialize.apply(this, arguments);
        },

        formTextInput: function (event) {
            if (event) {
                event.preventDefault();
                var $target = $(event.target);

                if ($target.is('[data-input="text"], [data-input="text"] *')) {
                    if ($target.next().is('[data-button="clear"], [data-button="clear"] *')) {
                        $target.next().toggleClass('hidden', ($target.val().length === 0));
                    }
                }
            }
            return this;
        },

        formSearchInput: function (event) {
            if (event) {
                event.preventDefault();
                var $target = $(event.target);

                if ($target.is('[data-input="search"], [data-input="search"] *')) {
                    if ($target.next().is('[data-button="clear"], [data-button="clear"] *')) {
                        $target.next().toggleClass('hidden', ($target.val().length === 0));
                    }
                    this.doSearch();
                }
            }
            return this;
        },

        formTelephoneInput: function (event) {
            if (event) {
                event.preventDefault();
                var $target = $(event.target);

                if ($target.is('[data-input="tel"], [data-input="tel"] *')) {
                    var targetVal = $target.val();
                    $target.val(utils.formatPhone(targetVal));
                    if ($target.next().is('[data-button="clear"], [data-button="clear"] *')) {
                        $target.next().toggleClass('hidden', (targetVal.length === 0));
                    }
                }
            }
            return this;
        },

        clearFormInput: function (event) {
            if (event) {
                event.preventDefault();
                var $target = $(event.target);

                if ($target.is('[data-button="clear"], [data-button="clear"] *')) {
                    var $trigger = $target.closest('[data-button="clear"]');
                    if ($trigger.attr('data-parent') !== null) {
                        $($trigger.attr('data-parent')).val('');
                        $trigger.toggleClass('hidden', true);
                    }
                }
            }
            return this;
        }
    });

    BaseFormView.extend = BaseDetailView.extend;

    return BaseFormView;

});