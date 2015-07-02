define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/base/CompositeView'),
            template = require('hbs!templates/PersonnelListItem');

    var PersonnelListItemView = CompositeView.extend({
        
        tagName: 'li',
        className: 'list-item personnel-list-item',
        
        initialize: function(options) {
            console.debug('PersonnelListItemView.initialize');
            options || (options = {});
            this.model.on('change', this.render, this);
        },
        render: function() {
            this.$el.html(template(this.model.attributes));
            return this;
        }

    });
    
    return PersonnelListItemView;

});