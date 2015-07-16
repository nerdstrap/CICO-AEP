define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var config = require('config');
    var EventNameEnum = require('enums/EventNameEnum');
    var PersonnelTileView = require('views/PersonnelTileView');

    var PersonnelCollectionView = BaseView.extend({
        className: 'list-view personnel-list-view',
        initialize: function(options) {
            console.debug('PersonnelCollectionView.initialize');
            options || (options = {});
            this.listenTo(this.collection, 'reset', this.addAll);
        },
        addAll: function() {
            this.$el.empty();
            _.each(this.collection.models, this.addOne, this);
        },
        addOne: function(personnel) {
            var personnelTileView = new PersonnelTileView({
                model: personnel
            });
            this.renderChild(personnelTileView);
            this.$el.append(personnelTileView.el);
        }

    });

    return PersonnelCollectionView;

});