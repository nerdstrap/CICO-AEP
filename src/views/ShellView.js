'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var HeaderView = require('views/HeaderView');
var FooterView = require('views/FooterView');
var template = require('templates/ShellView.hbs');

var ShellView = BaseView.extend({

    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, arguments);
        options || (options = {});
        this.dispatcher = options.dispatcher || this;
    },

    render: function () {
        this.setElement(template(this.renderModel(this.model)));
        this.renderHeaderView();
        this.renderFooterView();
        return this;
    },

    renderHeaderView: function () {
        this.headerView = new HeaderView({
            dispatcher: this.dispatcher
        });
        this.replaceWithChild(this.headerView, '#header-view-placeholder');
        return this;
    },

    renderFooterView: function () {
        this.footerView = new FooterView({
            dispatcher: this.dispatcher
        });
        this.replaceWithChild(this.footerView, '#footer-view-placeholder');
        return this;
    },

    contentViewEl: function () {
        return $('#content-view-container', this.el);
    }

});

module.exports = ShellView;