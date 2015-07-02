define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            template = require('hbs!templates/Menu'),
            CompositeView = require('views/base/CompositeView'),
            env = require('env');

    var MenuView = CompositeView.extend({
        tagName: 'span',
        defaults: {
            title: null
        },
        initialize: function(options) {
            console.debug('MenuView.initialize');
            options || (options = {});
            this.title = options.title;
        },
        events: {
            'click .menu-button': 'menuButtonClick'
        },
        render: function() {
            console.debug('MenuView.render');
            this.$el.html(template({
                title: this.title
            }));

            return this;
        },
        menuButtonClick: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.trigger('activate');
        },
        showMenuButton: function() {
            this.$el.removeClass('invisible');
        },
        hideMenuButton: function() {
            this.$el.addClass('invisible');
        },
        getButton: function() {
            return this.$el;
        },
        getButtonImage: function() {
            return this.$('img').attr('src');
        },
        setButtonImage: function(src) {
            return this.$('img').attr('src',src);
        }
    });

    return MenuView;
});