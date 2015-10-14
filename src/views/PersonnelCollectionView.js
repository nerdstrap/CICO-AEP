'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var PersonnelTileView = require('views/PersonnelTileView');
var utils = require('lib/utils');
var template = require('templates/PersonnelCollectionView.hbs');

var PersonnelCollectionView = BaseView.extend({

    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, arguments);

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
        var errorMessage = utils.getResource('personnelCollectionErrorMessageText');
        if (error && error.code === 1) {
            errorMessage = utils.getResource('gpsDisabledErrorMessageText');
        }
        if (error && error.code === 2) {
            errorMessage = utils.getResource('gpsUnavailableErrorMessageText');
        }
        if (error && error.code === 3) {
            errorMessage = utils.getResource('gpsTimedOutErrorMessageText');
        }
        this.showError(errorMessage);
    }

});

module.exports = PersonnelCollectionView;