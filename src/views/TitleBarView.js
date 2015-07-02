define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            template = require('hbs!templates/TitleBar'),
            CompositeView = require('views/base/CompositeView'),
            MenuView = require('views/MenuView'),
            CheckInMenuView = require('views/CheckInMenuView'),
            env = require('env');

    var TitleBarView = CompositeView.extend({
        getDefaultsForRendering: function() {
            return {
                showSearchMenu: true,
                showPersonnelMenu: true
            };
        },
        initialize: function(options) {
            console.debug('TitleBarView.initialize');
            options || (options = {});
            this.title = options.title;

            this.searchMenuViewInstance = new MenuView({
                className: 'menu-view searchMenuView',
                title: env.getSearchButton()
            });
            this.personnelMenuViewInstance = new MenuView({
                className: 'menu-view personnelMenuView',
                title: env.getPersonnelButton()
            });
            this.openCheckInMenuViewInstance = new CheckInMenuView({
                className: 'menu-view openCheckInMenuView',
                title: env.getCheckedInButton()
            });
        },
        events: {
            'click .brandTitle': 'brandTitleButtonClick'
        },
        render: function() {
            console.debug('TitleBarView.render');
            this.$el.html(template({
                title: this.title
            }));

            var menuViewsContainer = $('.menu-views', this.el);
            this.appendChildTo(this.personnelMenuViewInstance, menuViewsContainer);
            this.appendChildTo(this.searchMenuViewInstance, menuViewsContainer);
            this.appendChildTo(this.openCheckInMenuViewInstance, menuViewsContainer);

            this.listenTo(this.searchMenuViewInstance, 'activate', this.searchMenuViewActivate);
            this.listenTo(this.personnelMenuViewInstance, 'activate', this.personnelMenuViewActivate);
//            this.listenTo(this.openCheckInMenuViewInstance, 'activate', this.openCheckInMenuViewActivate);

            return this;
        },
        brandTitleButtonClick: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.trigger('brandTitleButtonClick');
        },
        searchMenuViewActivate: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.trigger('goToStationSearch');
        },
        personnelMenuViewActivate: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.trigger('goToPersonnelSearch');
        },
//        openCheckInMenuViewActivate: function(event) {
//            if (event) {
//                event.preventDefault();
//            }
//            this.trigger('goToOpenCheckIn', openStationEntryLogModel);
//        },
        updateViewFromModel: function(options) {
            options || (options = {});
            this.title = options.title;
            if (options.showSearchMenu) {
                this.showSearchMenu();
            } else {
                this.hideSearchMenu();
            }
            if (options.showPersonnelMenu) {
                this.showPersonnelMenu();
            } else {
                this.hidePersonnelMenu();
            }
        },
        showSearchMenu: function() {
            this.searchMenuViewInstance.showMenuButton();
        },
        hideSearchMenu: function() {
            this.searchMenuViewInstance.hideMenuButton();
        },
        showPersonnelMenu: function() {
            this.personnelMenuViewInstance.showMenuButton();
        },
        hidePersonnelMenu: function() {
            this.personnelMenuViewInstance.hideMenuButton();
        }
    });

    return TitleBarView;
});