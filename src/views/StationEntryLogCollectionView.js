'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var StationEntryLogTileView = require('views/StationEntryLogTileView');
var utils = require('lib/utils');
var template = require('templates/StationEntryLogCollectionView.hbs');

var StationEntryLogCollectionView = BaseView.extend({

    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, arguments);
        options || (options = {});
        this.dispatcher = options.dispatcher || this;
        this.showStation = options.showStation;
        this.showPersonnel = options.showPersonnel;
        this.loadingMessageText = options.loadingMessageText || utils.getResource('stationEntryLogCollectionLoadingMessageText');
        this.errorMessageText = options.errorMessageText || utils.getResource('stationEntryLogCollectionErrorMessageText');
        this.headerTextFormatString = options.headerTextFormatString || utils.getResource('stationEntryLogCollectionHeaderTextFormatString');
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

    appendTile: function (stationEntryLogModel) {
        var stationEntryLogTileView = new StationEntryLogTileView({
            dispatcher: this.dispatcher,
            model: stationEntryLogModel,
            showStation: this.showStation,
            showPersonnel: this.showPersonnel
        });
        this.appendChildTo(stationEntryLogTileView, '.tile-wrap');
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

module.exports = StationEntryLogCollectionView;