define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var config = require('config');
    var EventNameEnum = require('enums/EventNameEnum');
    var template = require('hbs!templates/PersonnelTileView');

    var PersonnelTileView = BaseView.extend({
        
        tagName: 'li',
        className: 'list-item personnel-list-item',
        
        initialize: function(options) {
            console.debug('PersonnelTileView.initialize');
            options || (options = {});
            this.model.on('change', this.render, this);
        },
        render: function() {
            this.$el.html(template(this.model.attributes));
            return this;
        }

    });
    
    return PersonnelTileView;

});