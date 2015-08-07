define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');

    var BaseCollectionView = function (options) {
        BaseView.apply(this, [options]);
    };

    _.extend(BaseCollectionView.prototype, BaseView.prototype, {

        initialize: function () {
            BaseView.prototype.initialize.apply(this, arguments);
        },

        progressEl: function () {
            return this.$('.' + this.cid + '-progress');
        },

        errorEl: function () {
            return this.$('.' + this.cid + '-error');
        },

        loadingEl: function () {
            return this.$('.' + this.cid + '-loading');
        },

        infoEl: function () {
            return this.$('.' + this.cid + '-info');
        },

        showProgress: function (message) {
            this.progressEl().toggleClass('hidden', false);
            if (message) {
                this.progressEl().children('.progress-message').text(message);
            }
            this.errorEl().toggleClass('hidden', true);
            this.loadingEl().toggleClass('hidden', true);

            return this;
        },

        hideProgress: function () {
            this.progressEl().toggleClass('hidden', true);
            return this;
        },

        showError: function (message) {
            this.errorEl().toggleClass('hidden', false);
            if (message) {
                this.errorEl().children('.error-message').text(message);
            }
            this.progressEl().toggleClass('hidden', true);
            this.loadingEl().toggleClass('hidden', true);
            return this;
        },

        hideError: function () {
            this.errorEl().toggleClass('hidden', true);
            return this;
        },

        showLoading: function () {
            this.loadingEl().toggleClass('hidden', false);
            this.progressEl().toggleClass('hidden', true);
            this.errorEl().toggleClass('hidden', true);
            return this;
        },

        hideLoading: function () {
            this.loadingEl().toggleClass('hidden', true);
            return this;
        },

        showInfo: function (message) {
            this.infoEl().toggleClass('hidden', false);
            if (message) {
                this.infoEl().children('.info-message').text(message);
            }
            return this;
        },

        hideInfo: function () {
            this.infoEl().toggleClass('hidden', true);
            return this;
        },

        togglePanel: function (event) {
            if (event) {
                var $target = $(event.target);
                if ($target.is('[data-toggle="panel"], [data-toggle="panel"] *')) {
                    var $trigger = $target.closest('[data-toggle="panel"]');
                    $trigger.parent().toggleClass('active');
                    if ($trigger.attr('data-target') !== null) {
                        $($trigger.attr('data-target')).toggleClass('hidden');
                    }
                }
            }
        }
    });

    BaseCollectionView.extend = BaseView.extend;

    return BaseCollectionView;

});