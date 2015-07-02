define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/base/CompositeView'),
            PersonnelListItemView = require('views/PersonnelListItemView');

    var PersonnelListView = CompositeView.extend({
        className: 'list-view personnel-list-view',
        
        initialize: function (options) {
            console.debug('PersonnelListView.initialize');
            options || (options = {});
            this.listenTo(this.collection, 'reset', this.addAll);
        },

        addAll: function () {
            this.$el.empty();
            _.each(this.collection.models, this.addOne, this);
        },
                
        addOne: function(personnel){
            var personnelListItemView = new PersonnelListItemView({
                model: personnel
            });
            this.renderChild(personnelListItemView);
            this.$el.append(personnelListItemView.el);
        }

    });
    
    return PersonnelListView;

});