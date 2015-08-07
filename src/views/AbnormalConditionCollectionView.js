define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseCollectionView = require('views/BaseCollectionView');
    var EventNameEnum = require('enums/EventNameEnum');
    var AbnormalConditionTileView = require('views/AbnormalConditionTileView');
    var utils = require('utils');
    var template = require('hbs!templates/AbnormalConditionCollectionView');

    var AbnormalConditionCollectionView = BaseCollectionView.extend({

        initialize: function (options) {
            BaseCollectionView.prototype.initialize.apply(this, arguments);

            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.loadingMessageText = options.loadingMessageText || utils.getResource('abnormalConditionCollectionLoadingMessageText');
            this.errorMessageText = options.errorMessageText || utils.getResource('abnormalConditionCollectionErrorMessageText');
            this.headerTextFormatString = options.headerTextFormatString || utils.getResource('abnormalConditionCollectionHeaderTextFormatString');

            this.listenTo(this.collection, 'sync', this.onSync);
            this.listenTo(this.collection, 'reset', this.onReset);
            this.listenTo(this.collection, 'error', this.onError);
        },

        render: function () {
            this.setElement(template(this.renderModel()));
            return this;
        },

        events: {
            'click [data-toggle="panel"]': 'togglePanel'
        },

        appendTile: function (abnormalConditionModel) {
            var abnormalConditionTileView = new AbnormalConditionTileView({
                dispatcher: this.dispatcher,
                model: abnormalConditionModel
            });
            this.appendChildTo(abnormalConditionTileView, '.tile-wrap');
            return this;
        },

        onSync: function () {
            this.hideInfo();
            this.showProgress();
        },

        onReset: function () {
            this._leaveChildren();
            _.each(this.collection.models, this.appendTile, this);
            this.showLoading();
            this.showInfo(utils.formatString(this.headerTextFormatString, [this.collection.models.length]));
        },

        onError: function (error) {
            this.showError(this.errorMessageText);
        }
    });

    return AbnormalConditionCollectionView;

});