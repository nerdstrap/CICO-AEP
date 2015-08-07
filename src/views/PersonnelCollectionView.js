define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseCollectionView = require('views/BaseCollectionView');
    var EventNameEnum = require('enums/EventNameEnum');
    var PersonnelTileView = require('views/PersonnelTileView');
    var utils = require('utils');
    var template = require('hbs!templates/PersonnelCollectionView');

    var PersonnelCollectionView = BaseCollectionView.extend({

        initialize: function (options) {
            BaseCollectionView.prototype.initialize.apply(this, arguments);

            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.collection, 'sync', this.onSync);
            this.listenTo(this.collection, 'reset', this.onReset);
            this.listenTo(this.collection, 'error', this.onError);
        },

        render: function () {
            this.setElement(template(this.renderModel()));
            return this;
        },

        appendTile: function (personnelModel) {
            var personnelTileView = new PersonnelTileView({
                dispatcher: this.dispatcher,
                model: personnelModel
            });
            this.appendChildTo(personnelTileView, '.tile-wrap');
            return this;
        },

        onSync: function () {
            this.hideInfo();
            this.showProgress();
        },

        onReset: function () {
            this.hideInfo();
            if (this.collection.models && this.collection.models.length < 1) {
                this.showInfo(utils.getResource('noResultsMessageText'));
            }
            this._leaveChildren();
            _.each(this.collection.models, this.appendTile, this);
            this.showLoading();
        },

        onError: function (error) {
            var errorMessage = utils.getResource('personnelCollectionErrorMessage');
            if (error && error.code === 1) {
                errorMessage = utils.getResource('gpsDisabledErrorMessage');
            }
            if (error && error.code === 2) {
                errorMessage = utils.getResource('gpsUnavailableErrorMessage');
            }
            if (error && error.code === 3) {
                errorMessage = utils.getResource('gpsTimedOutErrorMessage');
            }
            this.showError(errorMessage);
        }
    });

    return PersonnelCollectionView;

});