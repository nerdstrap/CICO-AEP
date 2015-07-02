define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/base/CompositeView'),
            cicoEvents = require('cico-events'),
            template = require('hbs!templates/ConfirmWarningListItem');
            
    var ConfirmWarningListItemView = CompositeView.extend({
        tagName: 'li',
        className: 'row',
        initialize: function(options) {
            console.trace('ConfirmWarningListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;

            this.listenTo(this, 'leave', this.onLeave);
            this.listenTo(this.model, cicoEvents.clearWarningSuccess, this.onClearWarningSuccess);
            this.listenTo(this.model, cicoEvents.clearWarningError, this.onClearWarningError);
        },
        render: function() {
            console.trace('ConfirmWarningListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .confirm-warning-button': 'confirmWarning',
            'click .clear-warning-button': 'clearWarning',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        confirmWarning: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.model.set({'confirmed': true});
            this.$('.confirm-warning-button').addClass('check-in').children('i').removeClass('fa-question').addClass('fa-check');
        },
        clearWarning: function(event) {
            if (event) {
                event.preventDefault();
            }
            cicoEvents.trigger(cicoEvents.clearWarning, this.model);
        },
        onClearWarningSuccess: function(stationWarningModel) {
            cicoEvents.trigger(cicoEvents.clearWarningSuccess, stationWarningModel);
            this.leave();
        },
        onClearWarningError: function(message) {
            this.showError(message);
        }
    });

    return ConfirmWarningListItemView;

});