define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var HeaderView = require('views/HeaderView');
    var FooterView = require('views/FooterView');
    var template = require('hbs!templates/ShellView');

    var ShellView = BaseView.extend({
        
        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
        },
        
        render: function() {
            var currentContext = this;
            currentContext.setElement(template(this.renderModel(this.model)));
            currentContext.renderHeaderView();
            currentContext.renderFooterView();
            return this;
        },
        
        renderHeaderView: function(){
            var currentContext = this;
            currentContext.headerView = new HeaderView({
                dispatcher: currentContext.dispatcher
            });
            currentContext.replaceWithChild(currentContext.headerView, '#header-view-placeholder');
            return this;
        },
        
        renderFooterView: function(){
            var currentContext = this;
            currentContext.footerView = new FooterView({
                dispatcher: currentContext.dispatcher
            });
            currentContext.replaceWithChild(currentContext.footerView, '#footer-view-placeholder');
            return this;
        },

        contentViewEl: function() {
            return $('#content-view-container', this.el);
        },

        modalViewEl: function() {
            return $('#modal-view-container', this.el);
        }

    });

    return ShellView;

});