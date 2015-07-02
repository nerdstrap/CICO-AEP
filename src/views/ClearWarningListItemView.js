define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/base/CompositeView'),
            cicoEvents = require('cico-events'),
            template = require('hbs!templates/ClearWarningListItem');

    var ClearWarningListItemView = CompositeView.extend({
        tagName: 'li',
        className: 'row',
        initialize: function(options) {
            console.trace('ClearWarningListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;

            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(this.model, cicoEvents.clearWarningSuccess, this.onClearWarningSuccess);
            this.listenTo(this.model, cicoEvents.clearWarningError, this.onClearWarningError);
            this.listenTo(cicoEvents, cicoEvents.clearWarningSuccess, this.leaveClearWarningItemView);
        },
        render: function() {
            console.trace('ClearWarningListItemView.render()');
            var currentContext = this;
            
            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .clear-warning-button': 'clearWarning',
            'click .close-alert-box-button': 'closeAlertBox'
        },
        updateModelFromView: function(){
            this.model.set({'lastModifiedBy': this.parentModel.get('userName')});
        },
        updateViewFromModel: function(){
            if (this.model.has('lastConfirmedBy') && this.model.get('lastConfirmedBy')) {
                this.$('#last-confirmed-by-container').removeClass('hidden');
            } else {
                this.$('#last-confirmed-by-container').addClass('hidden');
            }
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
            this.hideLoading();
            this.showError(message);
        },
        leaveClearWarningItemView: function(stationWarningModel) {
            var stationWarningId = stationWarningModel.stationWarningId;
            if(this.model.get('stationWarningId') === stationWarningId){
                this.leave();
            }
        }
    });

    return ClearWarningListItemView;

});